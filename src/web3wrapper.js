let Web3 = require('web3');
const BLOCKCHAIN_TYPE = process.env.BLOCKCHAIN_TYPE || 'NONE';

var web3Provider = null;
// Use injected web3 instance
if (BLOCKCHAIN_TYPE === 'ETH_MAINNET') {
  web3Provider = web3.currentProvider;
} else if(BLOCKCHAIN_TYPE === 'ETH_TESTNET') {
  // If no injected web3 instance is detected, fall back to Ganache
  web3Provider = new Web3
    .providers
    .HttpProvider('http://localhost:8545');
}

var web3 = new Web3(web3Provider);

module.exports = web3;