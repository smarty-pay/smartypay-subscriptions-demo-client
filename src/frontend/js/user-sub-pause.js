/*
dependencies:
  jquery (see: https://jquery.com/)
  ./api/backend.js
  ./app-state.jss
*/

function initUserSubscriptionPause(){

  const body = $('body');

  body.on('pause-user-subscription-req', async (event, planId)=> pauseUserSubscription(planId));
}

async function pauseUserSubscription(planId){

  if( ! AppState.walletConnected){
    return;
  }

  const body = $('body');
  const address = await AppState.walletApi.getAddress();

  const subscriptions = AppState.userSubscriptions[address] || [];
  const foundSub = subscriptions.find(sub => sub.planId === planId);
  const foundStatus = foundSub?.status;

  if(foundStatus && foundStatus !== 'Active'){
    console.log('sub already not active', foundSub);
    return;
  }


  body.trigger('global-loading-start');
  try {

    const {contractAddress, asset} = foundSub;
    const assetInfo = Assets[asset];

    const walletWeb3 = AppState.walletApi.getWalletWeb3();

    await Web3CommonApi.subscriptionPause(walletWeb3, assetInfo, address, contractAddress);

    // async notify backend about it
    Backend.pauseUserSubscription(contractAddress).catch(console.error);

    body.trigger('pause-user-subscription-success');

  } catch (e){
    console.error('cannot pause subscription', e);
    body.trigger('app-error', e);
    body.trigger('pause-user-subscription-failed');
  }
  finally {
    body.trigger('global-loading-stop');
  }
}