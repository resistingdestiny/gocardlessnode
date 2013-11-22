
/**
 * Module dependencies.
 */
var config = require('./accountdetails')
var gocardless = require('gocardless')(config);
var express = require('express');
var routes = require('./routes');
var thanks = require('./routes/thanks');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/thanks', function(req, res) {
  if (!gocardless.verifySignature(req.query, config.appSecret)) return res.end(403);

  gocardless.confirmResource({
    resource_id: req.query.resource_id,
    resource_type: req.query.resource_type
  }, function(err, request, body) {
    res.render('thanks', { title: 'Thank you' });
  });
 
  });


app.get('/bills', function(req, res) {
  gocardless.bill.index(function(error, response, data) {
  	data = JSON.parse(data);
    res.render('bills', { bills: data });
  });
});

app.get('/users', function(req, res) {
  gocardless.user.index(function(error, response, data) {
  	data = JSON.parse(data);
    res.render('users', { users: data });
  });
});

app.get('/subscriptions', function(req, res) {
  gocardless.subscription.index(function(error, response, data) {
  	data = JSON.parse(data);
    res.render('subscriptions', { subscriptions: data });
  });
});


app.get('/preauthorization', function(req, res) {
  gocardless.preAuthorization.index(function(error, response, data) {
  	data = JSON.parse(data);
    res.render('preauthorization', { preauthorization: data });
  });
});

app.get('/billid/:id', function(req, res) {
	gocardless.bill.find(req.params.id, function(error, response, data)  {										
		data = JSON.parse(data);
		res.render('billid', { bill:data });
	
	});
});

app.get('/subid/:id', function(req, res) {
	gocardless.subscription.find(req.params.id, function(error, response, data)  {										
		data = JSON.parse(data);
		res.render('subid', { subid:data });
	
	});
});

app.get('/authid/:id', function(req, res) {
	gocardless.preAuthorization.find(req.params.id, function(error, response, data)  {										
		data = JSON.parse(data);
		res.render('authid', { authid:data });
	
	});
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.post('/subscribe', function(req, res) {
  var url = gocardless.subscription.newUrl({
  amount: '1.25',
  interval_length: '1',
  interval_unit: 'month',
  name: 'Coffee',
  description: 'Fresh roast coffee subscription',
  setup_fee: '10.00'
});

res.redirect(url);
});



app.post('/preauth', function(req, res) {
var url = gocardless.preAuthorization.newUrl({
  max_amount: '15.00',
  interval_length: '3',
  interval_unit: 'month',
  name: 'Pizza',
  description: 'Pizza every single month'
});




res.redirect(url); 
}); 

app.post('/buy', function(req, res) {
	var descript  = req.body.description
	var cost = req.body.price
  	
    var url = gocardless.bill.newUrl({
    amount: cost,
    name: descript,
    //description: 'Delicious Fried Chicken'

});

    res.redirect(url); 
}); 

