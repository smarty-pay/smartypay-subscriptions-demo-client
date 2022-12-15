/*
dependencies:
  jquery (see: https://jquery.com/)
  ./app-state.jss
*/

function initDisconnectWalletButton(){

  const body = $('body');
  const button = $('#disconnect-wallet');

  body.on('wallet-connected', ()=> button.removeClass('hide'));
  body.on('wallet-disconnected', ()=> button.addClass('hide'));
  body.on('wallet-disconnected-by-remote', ()=> clearWalletApi());
  body.on('global-loading-start', ()=> button.attr('disabled', 'disabled'));
  body.on('global-loading-stop', ()=> button.removeAttr('disabled'));

  button.click( async ()=>{

    if( ! AppState.walletApi){
      return;
    }

    await AppState.walletApi.disconnect();
    clearWalletApi();
  });
}