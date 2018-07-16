const TruffleContract = require('truffle-contract');

class DavContracts {
  

  constructor(web3) {
    this.web3 = web3;
    this.contracts = {
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
  }

  async getInstance(contract) {
    if(this.contracts[contract].instance == null) {
      this.contracts[contract].artifact.setProvider(this.web3.currentProvider);
      this.contracts[contract].instance = await this.contracts[contract].artifact.deployed();
    }
    return this.contracts[contract].instance;
  }
}

module.exports = DavContracts;
