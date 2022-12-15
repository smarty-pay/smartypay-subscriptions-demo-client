/*
dependencies:
  jquery (see: https://jquery.com/)
  bignumber.js (see: https://mikemcl.github.io/bignumber.js/)
  ./api/backend.js
  ./api/web3-common.js
  ./app-state.jss
*/

function initUserSubscriptionDeactivation(){

  const body = $('body');

  body.on('deactivate-user-subscription-req', async (event, planId)=> deactivateUserSubscription(planId));
}

async function deactivateUserSubscription(planId){

  if( ! AppState.walletConnected){
    return;
  }

  const body = $('body');
  const address = await AppState.walletApi.getAddress();

  const foundPlan = AppState.subscriptionPlans.find(plan => plan.id === planId);
  if( ! foundPlan){
    console.log('cannot find sub plan by id', planId);
  }

  const [, asset] = foundPlan.amount.split(' ');
  const assetInfo = Assets[asset];

  const subscriptions = AppState.userSubscriptions[address] || [];
  const foundSub = subscriptions.find(sub => sub.planId === planId);
  const foundStatus = foundSub?.status;

  if(!foundStatus){
    console.log('cannot find sub by plan id', planId);
    return;
  }


  body.trigger('global-loading-start');
  try {

    const {contractAddress} = foundSub;

    const curAllowance = await Web3CommonApi.getTokenAllowance(assetInfo, address, contractAddress);

    // take approval from wallet to spend a token by subscription contract
    if(curAllowance.comparedTo(new BigNumber(0)) > 0){

      body.trigger('wait-wallet-operation-start');

      const walletWeb3 = AppState.walletApi.getWalletWeb3();
      await Web3CommonApi.walletTokenApprove(walletWeb3, assetInfo, address, contractAddress, '0x0');

      body.trigger('wait-wallet-operation-stop');
    }

    // deactivate subscription in backend
    await Backend.deactivateUserSubscription(contractAddress);

    body.trigger('deactivate-user-subscription-success');

  } catch (e){
    console.error('cannot deactivate subscription', e);
    body.trigger('app-error', e);
    body.trigger('deactivate-user-subscription-failed');
  }
  finally {
    body.trigger('global-loading-stop');
  }


}