/*
dependencies:
  jquery (see: https://jquery.com/)
  bignumber.js (see: https://mikemcl.github.io/bignumber.js/)
  ./api/backend.js
  ./api/web3-common.js
  ./app-state.jss
*/

function initUserSubscriptionActivation(){

  const body = $('body');

  body.on('activate-user-subscription-req', async (event, planId)=> activateUserSubscription(planId));
}

async function activateUserSubscription(planId){

  if( ! AppState.walletConnected){
    return;
  }

  const body = $('body');
  const address = await AppState.walletApi.getAddress();

  const foundPlan = AppState.subscriptionPlans.find(plan => plan.id === planId);
  if( ! foundPlan){
    console.log('cannot find sub plan by id', planId);
  }

  const [amount, asset] = foundPlan.amount.split(' ');
  const assetInfo = Assets[asset];
  const amountToPay = new BigNumber(amount).shiftedBy(assetInfo.decimals)

  const subscriptions = AppState.userSubscriptions[address] || [];
  const foundSub = subscriptions.find(sub => sub.planId === planId);
  const foundStatus = foundSub?.status;

  if(foundStatus && foundStatus !== 'Draft'){
    console.log('sub already exists', foundSub);
    return;
  }


  body.trigger('global-loading-start');
  try {

    const sub = await Backend.createUserSubscription(planId, address);
    const {contractAddress} = sub;

    const curBalance = await Web3CommonApi.getTokenBalance(assetInfo, address);
    if(amountToPay.comparedTo(curBalance) > 0){
      throw new Error(`Not enough ${assetInfo.abbr} token funds to activate the subscription`);
    }

    const curAllowance = await Web3CommonApi.getTokenAllowance(assetInfo, address, contractAddress);

    // take approval from wallet to spend a token by subscription contract
    if(amountToPay.comparedTo(curAllowance) > 0){

      body.trigger('wait-wallet-operation-start');

      const walletWeb3 = AppState.walletApi.getWalletWeb3();
      await Web3CommonApi.walletTokenApprove(walletWeb3, assetInfo, address, contractAddress);

      body.trigger('wait-wallet-operation-stop');
    }

    // activate subscription in backend
    await Backend.activateUserSubscription(contractAddress);

    body.trigger('activate-user-subscription-success');

  } catch (e){
    console.error('cannot activate subscription', e);
    body.trigger('app-error', e);
    body.trigger('activate-user-subscription-failed');
  }
  finally {
    body.trigger('global-loading-stop');
  }


}