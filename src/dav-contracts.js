const TruffleContract = require('truffle-contract');
const web3 = require('./web3wrapper');

function davContracts() {
  let contracts ={
    identity: {
      artifact: TruffleContract(require('../build/contracts/Identity.json')),
      instance: null
    },
    token: {
      artifact: TruffleContract(require('../build/contracts/DAVToken.json')),
      instance: null
    },
    mission: {
      artifact: TruffleContract(require('../build/contracts/BasicMission.json')),
      instance: null
    }
  };

  this.getInstance = function(contract) {
    return new Promise (function (resolve, reject) {
      if(contracts[contract].instance) {
        resolve(contracts[contract].instance);
      } else {
        contracts[contract].artifact.setProvider(web3.currentProvider);
        contracts[contract].artifact.deployed()
          .then(function (instance) {
            contracts[contract].instance = instance;
            resolve(contracts[contract].instance);
          }).catch(function(err) {
            reject(err);
          });
      }
    });
  };
}

module.exports = new davContracts();
