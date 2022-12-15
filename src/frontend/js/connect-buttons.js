/*
dependencies:
  jquery (see: https://jquery.com/)
  ./api/metamask.js
  ./api/wallet-connect.js
  ./app-state.js
*/


function initConnectButtons(){

  const body = $('body');
  const root = $('#connect-buttons');
  const topMenu = $('#top-menu');

  // hide menu for prevent init blinking after old connection restored
  topMenu.addClass('invisible');

  setTimeout(()=> {
    // show menu anyway after short pause (no blinking)
    topMenu.removeClass('invisible');
  }, 300);

  body.on('show-connect-buttons', ()=>{
    if( ! AppState.walletConnected){
      root.removeClass('hide');
    }
  });

  body.on('wallet-connected', ()=>{
    closeConnectButtons();
  });

  $('.btn-close', root).click(()=>{
    closeConnectButtons();
  });

  $('#connect-mm').click(()=> connectMetamask());
  $('#connect-wc').click(()=> connectWalletConnect());


  restoreOldWalletConnection().catch(console.error);
}

async function restoreOldWalletConnection(){

  const name = getLastConnectedWallet();

  if(name === 'MetamaskApi'){
    await connectMetamask();
  }
  else if(name === 'WalletConnectApi'){
    await connectWalletConnect();
  }

  // if old wallet connection restoring was fail then no need to try again on page's next reload
  setTimeout(()=>{
    if( ! AppState.walletConnected){
      clearLastConnectedWallet();
    }
  }, 3000);
}


function closeConnectButtons(){
  const body = $('body');
  const root = $('#connect-buttons');

  root.addClass('hide');
  body.trigger('connect-buttons-closed');
}


async function connectMetamask(){

  const body = $('body');

  if( ! MetamaskApi.hasWallet()){
    body.trigger('no-metamask');
    return;
  }

  try {

    // connect to metamask
    await MetamaskApi.connect();

    setWalletApi(MetamaskApi);

  } catch (e){
    console.error('cannot connect to metamask', e);
    body.trigger('wallet-connect-error', [e]);
  }
}


async function connectWalletConnect(){

  const body = $('body');

  try {

    // connect to metamask
    await WalletConnectApi.connect();

    setWalletApi(WalletConnectApi);

  } catch (e){
    console.error('cannot connect to wallet-connect', e);
    body.trigger('wallet-connect-error', [e]);
  }
}