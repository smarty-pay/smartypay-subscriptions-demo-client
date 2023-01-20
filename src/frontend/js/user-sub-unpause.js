/*
dependencies:
  jquery (see: https://jquery.com/)
  ./api/backend.js
  ./app-state.jss
*/

function initUserSubscriptionUnpause(){

  const body = $('body');

  body.on('unpause-user-subscription-req', async (event, planId)=> unpauseUserSubscription(planId));
}

async function unpauseUserSubscription(planId){

  if( ! AppState.walletConnected){
    return;
  }

  const body = $('body');
  const address = await AppState.walletApi.getAddress();

  const subscriptions = AppState.userSubscriptions[address] || [];
  const foundSub = subscriptions.find(sub => sub.planId === planId);
  const foundStatus = foundSub?.status;

  if(foundStatus && foundStatus !== 'Paused'){
    console.log('sub already not paused', foundSub);
    return;
  }


  body.trigger('global-loading-start');
  try {

    const {contractAddress, asset} = foundSub;
    const assetInfo = Assets[asset];

    const walletWeb3 = AppState.walletApi.getWalletWeb3();

    await Web3CommonApi.subscriptionUnpause(walletWeb3, assetInfo, address, contractAddress);

    // async notify backend about it
    Backend.unpauseUserSubscription(contractAddress).catch(console.error);;

    body.trigger('unpause-user-subscription-success');

  } catch (e){
    console.error('cannot unpause subscription', e);
    body.trigger('app-error', e);
    body.trigger('unpause-user-subscription-failed');
  }
  finally {
    body.trigger('global-loading-stop');
  }
}