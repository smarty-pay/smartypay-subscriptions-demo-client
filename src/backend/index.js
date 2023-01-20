const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const sha256 = require('js-sha256');
const {SmartyPayAPI} = require('smartypay-node-sdk');
const config = require('./config');

require('express-async-errors');



const app = express();
app.use(express.json());

// send static
app.use(express.static(path.join(__dirname, '../frontend')));





// SmartyPayAPI
const api = new SmartyPayAPI({
  host: config.appUrl,
  publicKey: config.apiKey,
  secretKey: config.apiSecret,
});

/*
  Get all subscriptions plans
 */
app.get('/api/subscription-plans', async (req, res) => {

  const plans = await api.subscriptions.getActivePlans();

  res.json({
    plans
  });
});


/*
  Get exists subscriptions for payer address
 */
app.get('/api/user/subscriptions', async (req, res) => {

  const {payer} = req.query;
  const subscriptions = await api.subscriptions.getSubscriptionsByPayer(payer);

  res.json({
    subscriptions
  });
});




/*
  Create subscription for payer
 */
app.post('/api/user/create-subscription', async (req, res) => {

  const {planId, payer} = req.body;

  const customerId = 'backend-customer-id' // use your own system's customer id
  const metadata = 'some usefull metadata' // optional metadata from your own system
  const startFrom = new Date().toISOString(); // minimal time to start

  const subscription = await api.subscriptions.createSubscription({
    planId,
    payer,
    customerId,
    metadata,
    startFrom,
  })

  res.json(subscription);

});


/*
  Activate subscription for payer
 */
app.post('/api/user/activate-subscription', async (req, res) => {

  const {contractAddress} = req.body;

  const subscription = await api.subscriptions.activateSubscription({contractAddress});

  res.json(subscription);
});

/*
  Pause subscription for payer
 */
app.post('/api/user/pause-subscription', async (req, res) => {

  const {contractAddress} = req.body;

  const subscription = await api.subscriptions.pauseSubscription({contractAddress});

  res.json(subscription);
});

/*
  Unpause subscription for payer
 */
app.post('/api/user/unpause-subscription', async (req, res) => {

  const {contractAddress} = req.body;

  const subscription = await api.subscriptions.unpauseSubscription({contractAddress});

  res.json(subscription);

});

/*
  Cancel subscription for payer
 */
app.post('/api/user/deactivate-subscription', async (req, res) => {

  const {contractAddress} = req.body;

  const subscription = await api.subscriptions.cancelSubscription({contractAddress});

  res.json(subscription);

});




// error handler
app.use((err, req, res, next) => {
  if(err.response && err.response.status){
    res.status(err.response.status).json(err.response);
  }
  else {
    console.error(err);
    res.status(500).send('Something broke!')
  }
})


const server = app.listen(config.port, () => {
  console.log('server is running on port', server.address().port);
});