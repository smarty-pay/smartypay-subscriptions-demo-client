/*
dependencies:
  jquery (see: https://jquery.com/)
  ./app-state.js
*/

function initTopStatus(){

  const body = $('body');

  // common status
  body.on('connect-buttons-closed', ()=> updateTopStatus());
  body.on('wallet-connected', async ()=> updateTopStatus());
  body.on('wallet-disconnected', async ()=> updateTopStatus());
  body.on('wallet-account-changed', async ()=> updateTopStatus());
  body.on('wait-wallet-operation-stop', async ()=> updateTopStatus());
  body.on('activate-user-subscription-success', ()=> updateTopStatus());
  body.on('deactivate-user-subscription-success', ()=> updateTopStatus());

  // special status
  body.on('no-metamask', ()=> showTopStatusNeedMetamask());
  body.on('wallet-connect-error', (event, error)=> showTopStatusWalletConnectError(error));
  body.on('wait-wallet-operation-start', async ()=> showTopStatusWaitWalletOperation());
  body.on('app-error', async (event, error)=> showTopStatusAppError(error));
  body.on('global-loading-start', ()=> showTopStatusGlobalLoading())

  updateTopStatus();
}


function updateTopStatus(){

  if( ! AppState.walletConnected){
    showTopStatusNeedWalletConnect();
  }
  else {
    showTopStatusWalletAddress().catch(console.error);
  }
}

function showTopStatusNeedWalletConnect(){
  const clone = $('#templates .top-status-connect-wallet').clone();
  updateTopStatusWithElem(clone);
}

function showTopStatusNeedMetamask(){
  const clone = $('#templates .top-status-need-metamask').clone();
  updateTopStatusWithElem(clone);
}

function showTopStatusWalletConnectError(err){
  const msg = err.message || err.toString();
  const clone = $('#templates .top-status-wallet-connection-error').clone();
  clone.find('.msg').text(msg);
  updateTopStatusWithElem(clone);
}

function showTopStatusAppError(err){
  const msg = err.message || err.toString();
  const clone = $('#templates .top-status-app-error').clone();
  clone.find('.msg').text(msg);
  updateTopStatusWithElem(clone);
}

async function showTopStatusWalletAddress(){

  const address = await AppState.walletApi.getAddress();
  const clone = $('#templates .top-status-wallet-address').clone();
  clone.find('.address').text(address);
  updateTopStatusWithElem(clone);
}


function showTopStatusWaitWalletOperation(){
  const clone = $('#templates .top-status-wait-wallet-operation').clone();
  updateTopStatusWithElem(clone);
}

function showTopStatusGlobalLoading(){
  const clone = $('#templates .top-status-global-loading').clone();
  updateTopStatusWithElem(clone);
}

function updateTopStatusWithElem(elem){

  clearTopStatus();

  const alertType = elem.attr('data-alert-type') || 'primary';
  const closable = elem.attr('data-closable') === 'true';

  const root = $('#top-status');
  root.append(elem);
  root.addClass(`alert-${alertType}`);
  root.removeClass('hide');

  if(closable){
    const closeButton = $('<button type="button" class="btn-close"></button>');
    closeButton.click(()=> updateTopStatus());
    root.append(closeButton);
  }
}


function clearTopStatus(){
  const root = $('#top-status');
  root.empty();
  root.addClass('hide');
  root.removeClass('alert-primary alert-warning')
}