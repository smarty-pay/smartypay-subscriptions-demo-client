/*
dependencies:
  web3.js (see: https://web3js.readthedocs.io/)
  bignumber.js (see: https://mikemcl.github.io/bignumber.js/)
  ./blockchains.js
*/

/*
  Common API for all blockchains and wallets
 */
const Web3CommonApi = {


  async getTokenBalance(assetInfo, ownerAddress){

    const {network, tokenId, decimals} = assetInfo;
    const {rpc} = Blockchains[network];

    // readonly methods can be called without wallet
    const web3 = new Web3(rpc);

    const contract = new web3.eth.Contract(Erc20ABI, tokenId);
    const balance = await contract.methods.balanceOf(ownerAddress).call();
    return new BigNumber(balance).shiftedBy(decimals);
  },

  async getTokenAllowance(assetInfo, ownerAddress, spenderAddress){

    const {network, tokenId, decimals} = assetInfo;
    const {rpc} = Blockchains[network];

    // readonly methods can be called without wallet
    const web3 = new Web3(rpc);

    const contract = new web3.eth.Contract(Erc20ABI, tokenId);
    const allowance = await contract.methods.allowance(ownerAddress, spenderAddress).call();
    return new BigNumber(allowance).shiftedBy(decimals);
  },

  async walletTokenApprove(walletWeb3, assetInfo, ownerAddress, spenderAddress, approveAmount){

    await Web3CommonApi.switchWalletToAssetNetwork(walletWeb3, assetInfo);

    const {tokenId} = assetInfo;
    const contract = new walletWeb3.eth.Contract(Erc20ABI, tokenId);
    const txResult = await contract.methods.approve(spenderAddress, approveAmount || MaxAmount).send({
      from: ownerAddress
    });

    console.log('approve tx result', txResult);
  },


  async subscriptionPause(walletWeb3, assetInfo, ownerAddress, contractAddress){

    await Web3CommonApi.switchWalletToAssetNetwork(walletWeb3, assetInfo);

    const contract = new walletWeb3.eth.Contract(SubscriptionABI, contractAddress);
    const txResult = await contract.methods.freeze().send({
      from: ownerAddress
    });

    console.log('pause tx result', txResult);
  },

  async subscriptionUnpause(walletWeb3, assetInfo, ownerAddress, contractAddress){

    await Web3CommonApi.switchWalletToAssetNetwork(walletWeb3, assetInfo);

    const contract = new walletWeb3.eth.Contract(SubscriptionABI, contractAddress);
    const txResult = await contract.methods.unfreeze().send({
      from: ownerAddress
    });

    console.log('unpause tx result', txResult);
  },

  async switchWalletToAssetNetwork(walletWeb3, assetInfo){

    const {network} = assetInfo;
    const {chainIdHex, chainId} = Blockchains[network];

    const walletChainId = await walletWeb3.eth.getChainId();
    if(walletChainId !== chainIdHex && walletChainId !== chainId){
      console.log('switch wallet network', {from: walletChainId, to: chainIdHex})
      await Web3CommonApi.switchWalletToNetwork(walletWeb3, network);
    }
  },

  async switchWalletToNetwork(walletWeb3, network){

    const {chainIdHex, chainName, native, rpc, explorer} = Blockchains[network];

    const result = await walletWeb3.currentProvider.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: chainIdHex,
        chainName,
        nativeCurrency: {
          name: native,
          symbol: native,
          decimals: 18,
        },
        rpcUrls: [rpc],
        blockExplorerUrls: [explorer],
      }],
    });

    console.log('wallet switch network result', result);
  }

}