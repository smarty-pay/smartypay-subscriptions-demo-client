const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const sha256 = require('js-sha256');
const config = require('./config');

require('express-async-errors');



const app = express();
app.use(express.json());

// send static
app.use(express.static(path.join(__dirname, '../frontend')));

/*
  Get all subscriptions plans
 */
app.get('/api/subscription-plans', async (req, res) => {

  const apiPath = '/integration/subscription-plans';
  const now = Date.now();
  const ts = Math.round(now / 1000).toString();
  const body = ''; // empty body stub for GET signature

  const messageToSign = ts + `GET${apiPath}` + body;
  const sig = sha256.hmac(config.apiSecret, messageToSign);

  const response = await fetch(`${config.appUrl}${apiPath}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'x-api-sig': sig,
      'x-api-ts': ts,
    }
  });

  const out = await response.json();
  res.status(response.status).json(out);

});


/*
  Get exists subscriptions for payer address
 */
app.get('/api/user/subscriptions', async (req, res) => {

  const {payer} = req.query;

  const apiPath = `/integration/subscriptions?payer=${payer}`;
  const now = Date.now();
  const ts = Math.round(now / 1000).toString();
  const body = ''; // empty body stub for GET signature

  const messageToSign = ts + `GET${apiPath}` + body;
  const sig = sha256.hmac(config.apiSecret, messageToSign);

  const response = await fetch(`${config.appUrl}${apiPath}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'x-api-sig': sig,
      'x-api-ts': ts,
    }
  });

  const out = await response.json();
  res.status(response.status).json(out);

});




/*
  Create subscription for payer
 */
app.post('/api/user/create-subscription', async (req, res) => {

  const {planId, payer} = req.body;

  const apiPath = '/integration/subscriptions';
  const now = Date.now();
  const ts = Math.round(now / 1000).toString();

  const customerId = 'backend-customer-id' // use your own system's customer id
  const metadata = 'some usefull metadata' // optional metadata from your own system
  const startFrom = new Date().toISOString(); // minimal time to start

  const body = JSON.stringify({
    planId,
    payer,
    customerId,
    metadata,
    startFrom,
  });

  const messageToSign = ts + `POST${apiPath}` + body;
  const sig = sha256.hmac(config.apiSecret, messageToSign);

  const response = await fetch(`${config.appUrl}${apiPath}`, {
    method: 'POST',
    body,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'x-api-sig': sig,
      'x-api-ts': ts,
    }
  });

  const out = await response.json();
  res.status(response.status).json(out);

});


/*
  Activate subscription for payer
 */
app.post('/api/user/activate-subscription', async (req, res) => {

  const {contractAddress} = req.body;

  const apiPath = `/integration/subscriptions/${contractAddress}/activate`;
  const now = Date.now();
  const ts = Math.round(now / 1000).toString();

  const body = JSON.stringify({});

  const messageToSign = ts + `POST${apiPath}` + body;
  const sig = sha256.hmac(config.apiSecret, messageToSign);

  const response = await fetch(`${config.appUrl}${apiPath}`, {
    method: 'POST',
    body,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'x-api-sig': sig,
      'x-api-ts': ts,
    }
  });

  const out = await response.json();
  res.status(response.status).json(out);

});



/*
  Deactivate subscription for payer
 */
app.post('/api/user/deactivate-subscription', async (req, res) => {

  const {contractAddress} = req.body;

  const apiPath = `/integration/subscriptions/${contractAddress}/deactivate`;
  const now = Date.now();
  const ts = Math.round(now / 1000).toString();

  const body = JSON.stringify({});

  const messageToSign = ts + `POST${apiPath}` + body;
  const sig = sha256.hmac(config.apiSecret, messageToSign);

  const response = await fetch(`${config.appUrl}${apiPath}`, {
    method: 'POST',
    body,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'x-api-sig': sig,
      'x-api-ts': ts,
    }
  });

  const out = await response.json();
  res.status(response.status).json(out);

});




const server = app.listen(config.port, () => {
  console.log('server is running on port', server.address().port);
});