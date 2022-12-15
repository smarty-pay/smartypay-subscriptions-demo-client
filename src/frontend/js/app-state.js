/**
 * App state for all components
 */
const AppState = {

  walletConnected: false,
  walletApi: undefined,
  subscriptionPlans: [],
  userSubscriptions: {},

}


function setSubscriptionPlans(plans){
  const body = $('body');

  AppState.subscriptionPlans = plans;

  body.trigger('subscription-plans-updated');
}

function setUserSubscriptions(address, subscriptions){

  const body = $('body');

  // ignore Cancelled subs
  if(subscriptions){
    subscriptions = subscriptions.filter(sub => sub.status !== 'Cancelled' && sub.status !== 'Draft');
  }

  AppState.userSubscriptions[address] = subscriptions;

  body.trigger('user-subscriptions-updated');
}


function setWalletApi(api){

  const body = $('body');

  AppState.walletConnected = true;
  AppState.walletApi = api;

  body.trigger('wallet-connected');

  try {
    window.localStorage.setItem('last-connected-wallet', api.name());
  } catch (e){
    // ignore
  }

}

function clearWalletApi(){

  const body = $('body');

  AppState.walletApi = undefined;
  AppState.walletConnected = false;
  body.trigger('wallet-disconnected');

  clearLastConnectedWallet();
}

function getLastConnectedWallet(){
  try {
    return window.localStorage.getItem('last-connected-wallet') || '';
  } catch (e){
    return '';
  }
}


function clearLastConnectedWallet(){
  try {
    window.localStorage.setItem('last-connected-wallet', '');
  } catch (e){
    // ignore
  }
}


