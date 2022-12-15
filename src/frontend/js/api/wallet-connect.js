/*
dependencies:
  web3.js (see: https://web3js.readthedocs.io/)
  wallet-connect-provider (see: https://docs.walletconnect.com/1.0/quick-start/dapps/web3-provider)
  ./blockchains.js
*/

/**
 * Wrapper for WalletConnectProvider object
 */
const WalletConnectApi = {

  _web3: undefined,
  _provider: undefined,

  name(){
    return 'WalletConnectApi';
  },

  hasWallet(){
    return true;
  },

  isConnected(){
    return !! WalletConnectApi._web3;
  },

  async connect(){

    if( WalletConnectApi.isConnected()){
      return;
    }

    // Show QR code screen
    const provider = makeWalletConnectProvider();
    await provider.enable();

    WalletConnectApi._web3 = new Web3(provider);
    WalletConnectApi._provider = provider;

    const body = $('body');

    // Listen WalletConnect events
    provider.on('accountsChanged', (accounts) => {
      const newAddress = accounts && accounts.length>0? accounts[0] : undefined;
      if( ! newAddress){
        WalletConnectApi.resetState();
        body.trigger('wallet-disconnected-by-remote');
      } else {
        body.trigger('wallet-account-changed', [newAddress]);
      }
    });

    provider.on('disconnect', () => {
      WalletConnectApi.resetState();
      body.trigger('wallet-disconnected-by-remote');
    });


  },

  async getAddress(){

    if( ! WalletConnectApi.isConnected()){
      throw new Error('wallet-connect not connected');
    }

    const accounts = await WalletConnectApi._web3.eth.getAccounts();
    return accounts[0];
  },

  async disconnect(){

    if( ! WalletConnectApi.isConnected()){
      return;
    }

    try {
      WalletConnectApi._provider.disconnect();
    } catch (e){
      console.error('WalletConnect disconnect error', e);
    }

    WalletConnectApi.resetState();
  },

  resetState(){
    WalletConnectApi._web3 = undefined;
    WalletConnectApi._provider = undefined;
  },

  getWalletWeb3(){
    return WalletConnectApi._web3;
  }
}


function makeWalletConnectProvider(){

  const WalletConnectProvider = window.WalletConnectProvider.default;

  const rpc = {
    1: 'https://cloudflare-eth.com',
    3: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    5: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    6: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    [Blockchains.BinanceMainNet.chainId]: Blockchains.BinanceMainNet.rpc,
    [Blockchains.BinanceTestNet.chainId]: Blockchains.BinanceTestNet.rpc,
    [Blockchains.PolygonMainNet.chainId]: Blockchains.PolygonMainNet.rpc,
    [Blockchains.PolygonMumbaiNet.chainId]: Blockchains.PolygonMumbaiNet.rpc,
    [Blockchains.ArbitrumMainNet.chainId]: Blockchains.ArbitrumMainNet.rpc,
    [Blockchains.ArbitrumTestNet.chainId]: Blockchains.ArbitrumTestNet.rpc,
  }

  return new WalletConnectProvider({
    rpc
  });
}