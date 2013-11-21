

/*
 * GET home page.
 */



exports.whole = function(req, res){
  res.render('catalog', { title: 'Catalog Page' });
};