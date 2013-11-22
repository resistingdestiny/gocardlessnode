This is a basic application using the GoCardless API.

Note, that in order to use this application you will need to create a file called accountdetails.js in which you will need to put:

module.exports = {
	appId: 'Your App ID',
	appSecret: 'Your App Secret',
	token: 'Your Account Token',
	merchantId: 'Your Merchant ID',
	sandbox : true
}


This details can be found by signing up at GoCardless.com and then selecting Sandbox and Developer Mode. 

If this app is going live then remove 'sandbox : true' from the accountdetails.js file as well as replace the Sandbox appID's, appSecret's and merchantId's.

Created as part of Work Experience with GoCardless 18th - 22nd November 2013 

