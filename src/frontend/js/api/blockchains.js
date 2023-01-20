

const Blockchains = {

  BinanceMainNet: {
    chainId: 56,
    chainIdHex: '0x38',
    rpc: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    chainName: 'Binance Smart Chain Mainnet',
    native: 'BNB',
  },
  BinanceTestNet: {
    chainId: 97,
    chainIdHex: '0x61',
    rpc: 'https://data-seed-prebsc-1-s3.binance.org:8545',
    explorer: 'https://testnet.bscscan.com',
    chainName: 'Binance Smart Chain Testnet',
    native: 'BNB',
  },
  PolygonMainNet: {
    chainId: 137,
    chainIdHex: '0x89',
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    chainName: 'Matic Mainnet',
    native: 'MATIC',
  },
  PolygonMumbaiNet: {
    chainId: 80001,
    chainIdHex: '0x13881',
    rpc: 'https://rpc-mumbai.matic.today',
    explorer: 'https://mumbai.polygonscan.com',
    chainName: 'Matic Testnet',
    native: 'MATIC',
  },
  ArbitrumMainNet: {
    chainId: 42161,
    chainIdHex: '0xa4b1',
    rpc: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    chainName: 'Arbitrum Mainnet',
    native: 'ETH',
  },
  ArbitrumTestNet: {
    chainId: 421613,
    chainIdHex: '0x66eed',
    rpc: 'https://goerli-rollup.arbitrum.io/rpc',
    explorer: 'https://testnet.arbiscan.io',
    chainName: 'Arbitrum Testnet',
    native: 'ETH',
  },
}


const Assets = {
  // BinanceMainNet
  bBUSD: {
    network: 'BinanceMainNet',
    tokenId: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    abbr: 'BUSD',
    decimals: 18,
  },
  bUSDT: {
    network: 'BinanceMainNet',
    tokenId: '0x55d398326f99059fF775485246999027B3197955',
    abbr: 'USDT',
    decimals: 18,
  },
  // BinanceTestNet
  btMNXe: {
    network: 'BinanceTestNet',
    tokenId: '0xd570e1ee81a8ca94008e1cf75c72b5e7a7b83bc5',
    abbr: 'EURx',
    decimals: 8,
  },
  btBUSD: {
    network: 'BinanceTestNet',
    tokenId: '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee',
    abbr: 'BUSD',
    decimals: 18,
  },
  btUSDTv2: {
    network: 'BinanceTestNet',
    tokenId: '0x3f43f5812c6e57a7c9ccb9cdc03104d1d907cd09',
    abbr: 'USDT',
    decimals: 18,
  },
  // PolygonMainNet
  pUSDC: {
    network: 'PolygonMainNet',
    tokenId: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    abbr: 'USDC',
    decimals: 6,
  },
  pUSDT: {
    network: 'PolygonMainNet',
    tokenId: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    abbr: 'USDT',
    decimals: 6,
  },
  // PolygonMumbaiNet
  pmUSDC: {
    network: 'PolygonMumbaiNet',
    tokenId: '0x7A7707cEE9bbF4D2Ce8f227865D456164841e4E5',
    abbr: 'USDC',
    decimals: 18,
  },
  pmUSDT: {
    network: 'PolygonMumbaiNet',
    tokenId: '0x9b3273282f3b68dbF9b2c35f784cB1a012Cd670B',
    abbr: 'USDT',
    decimals: 18,
  },
  // ArbitrumMainNet
  aUSDC: {
    network: 'ArbitrumMainNet',
    tokenId: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    abbr: 'USDC',
    decimals: 6,
  },
  aUSDT: {
    network: 'ArbitrumMainNet',
    tokenId: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    abbr: 'USDT',
    decimals: 6,
  },
  // ArbitrumTestNet
  atUSDT: {
    network: 'ArbitrumTestNet',
    tokenId: '0x4D126f75891e779021187f55314F95BE1D19e7ff',
    abbr: 'USDT',
    decimals: 18,
  },
  atUSDC: {
    network: 'ArbitrumTestNet',
    tokenId: '0x3668789EDa9D053Ee8B77653dA167CD73e6ef8fa',
    abbr: 'USDC',
    decimals: 18,
  }
}

const MaxAmount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';


const Erc20ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
];



const SubscriptionABI = [
  {
    "constant": false,
    "name": "freeze",
    "inputs": [],
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "name": "unfreeze",
    "inputs": [],
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
];