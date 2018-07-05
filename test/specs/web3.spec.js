jest.doMock('axios', () => {
  return {
    post: (url, data) => Promise.resolve({ data: []}), // eslint-disable-line no-unused-vars
    get: (url, data) => Promise.resolve({ data: [] }) // eslint-disable-line no-unused-vars
  };
});

jest.doMock('web3', () => { // eslint-disable-line no-unused-vars
  return class {};
});

jest.doMock('truffle-hdwallet-provider', () => { // eslint-disable-line no-unused-vars
  return class {};
});

jest.doMock('truffle-contract', () => { // eslint-disable-line no-unused-vars
  return (contract) => { // eslint-disable-line no-unused-vars
    let instance = {};
    for(let i in contract.abi) {
      if(contract.abi[i].type === 'function') {
        let resp = {};
        for(let o in contract.abi[i].outputs) {
          if(contract.abi[i].outputs[o].name === '' && contract.abi[i].outputs[o].type === 'bool') {
            resp = false;
          }
        }
        instance[contract.abi[i].name] = () => Promise.resolve(resp);
      }
    }
    return {
      setProvider: (provider) => Promise.resolve({ }), // eslint-disable-line no-unused-vars
      deployed: () => Promise.resolve(instance) // eslint-disable-line no-unused-vars
    };
  };
});

const { DavSDK } = require('../../src/index.js');
const mnemonic = require('./mnemonic');


describe('contract integration', () => {

  beforeAll(() => {
    process.env.NODE_ENV = 'development';
    process.env.ETH_NODE_URL = 'https://ropsten.infura.io/wUiZtmeZ1KwjFrcC8zRO';
  });

  test('test user is register', async () => {
    expect.assertions(1);
    const sdk = new DavSDK('0x4fFCe6A06CB4317a295acaDdbb3141c73158f954', '0x4fFCe6A06CB4317a295acaDdbb3141c73158f954', mnemonic);
    await expect(sdk.isRegistered()).resolves.toEqual(false);
  });


  test('test registerSimpel', async () => {
    expect.assertions(1);
    const sdk = new DavSDK('0x3e54f4d0A7C93516f962e5cfcB402dB6C2700C30', '0x3e54f4d0A7C93516f962e5cfcB402dB6C2700C30', mnemonic);
    await expect(sdk.isRegistered()).resolves.toEqual(true);
    await expect(sdk.registerSimple()).resolves.toEqual(true);
    await expect(sdk.isRegistered()).resolves.toEqual(true);
  });

});
