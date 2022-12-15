/*
dependencies:
  web3.js (see: https://cdnjs.com/libraries/web3)
  window.ethereum (see: https://docs.metamask.io/guide/)
  ./blockchains.js
*/

/**
 * Wrapper for Metamask window.ethereum object
 */
const MetamaskApi = {

  _web3: undefined,

  name(){
    return 'MetamaskApi';
  },

  hasWallet(){
    return !! window.ethereum;
  },

  isConnected(){
    return !! MetamaskApi._web3;
  },

  async connect(){

    if( MetamaskApi.isConnected()){
      return;
    }

    if( ! MetamaskApi.hasWallet()){
      throw new Error('no metamask');
    }

    // show Metamask Connect Screen
    await window.ethereum.request({ method: "eth_requestAccounts" });
    MetamaskApi._web3 = new Web3(window.ethereum);

    const body = $('body');

    // Listen Metamask events
    window.ethereum.on('accountsChanged', (accounts)=>{
      const newAddress = accounts && accounts.length>0? accounts[0] : undefined;
      if( ! newAddress){
        MetamaskApi.resetState();
        body.trigger('wallet-disconnected-by-remote');
      } else {
        body.trigger('wallet-account-changed', [newAddress]);
      }
    });
  },

  async getAddress(){

    if( ! MetamaskApi.isConnected()){
      throw new Error('metamask not connected');
    }

    const accounts = await MetamaskApi._web3.eth.getAccounts();
    return accounts[0];
  },

  async disconnect(){
    MetamaskApi.resetState();
  },

  resetState(){
    MetamaskApi._web3 = undefined;
  },

  getWalletWeb3(){
    return MetamaskApi._web3;
  }
}