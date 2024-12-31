const paypal = require('paypal-rest-sdk');
const {paypalClientId,paypalSecretId} = require('./envConfig')

paypal.configure({
    'mode': 'sandbox',
    'client_id': paypalClientId,
    'client_secret': paypalSecretId
});

module.exports = paypal;