/*
dependencies:
  ./top-status.js
  ./connect-wallet.js
  ./disconnect-wallet.js
  ./connect-buttons.js
  ./subscriptions-list.js
  ./user-sub-activation.js
  ./user-sub-deactivation.js
  ./user-sub-pause.js
  ./user-sub-unpause.js
*/

/**
 * Init main app elements
 */
function initApp(){

  initEventLogs();

  initTopStatus();
  initConnectWalletButton();
  initDisconnectWalletButton();
  initConnectButtons();
  initSubscriptionsList();
  initUserSubscriptionActivation();
  initUserSubscriptionDeactivation();
  initUserSubscriptionPause();
  initUserSubscriptionUnpause();
}


function initEventLogs(){

  const body = $('body');

  // app events to log in browser console
  [
    'app-error',
    'wallet-connected',
    'wallet-disconnected',
    'wallet-disconnected-by-remote',
    'wallet-account-changed',
    'wallet-connect-error',
    'wait-wallet-operation-start',
    'wait-wallet-operation-stop',
    'no-metamask',
    'global-loading-start',
    'global-loading-stop',
    'subscription-plans-updated',
    'user-subscriptions-updated',
    'show-connect-buttons',
    'connect-buttons-closed',
    'activate-user-subscription-req',
    'activate-user-subscription-success',
    'activate-user-subscription-failed',
    'deactivate-user-subscription-req',
    'deactivate-user-subscription-success',
    'deactivate-user-subscription-failed',
    'pause-user-subscription-req',
    'pause-user-subscription-success',
    'pause-user-subscription-failed',
    'unpause-user-subscription-req',
    'unpause-user-subscription-success',
    'unpause-user-subscription-failed',
  ].forEach(eventName => {
    body.on(eventName, log);
  })

  function log(event){
    console.log('[app-event]', event.type);
  }
}





initApp();