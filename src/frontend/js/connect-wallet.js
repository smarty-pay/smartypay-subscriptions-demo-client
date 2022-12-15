/*
dependencies:
  jquery (see: https://jquery.com/)
*/

function initConnectWalletButton(){

  const body = $('body');
  const button = $('#connect-wallet');

  body.on('wallet-connected', ()=>{
    button.addClass('hide');
  });

  body.on('wallet-disconnected', ()=>{
    button.removeClass('hide');
  })

  button.click(()=>{
    body.trigger('show-connect-buttons');
  });
}