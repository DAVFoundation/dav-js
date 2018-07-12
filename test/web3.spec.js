/* eslint-disable no-unused-vars */

const { DavSDK } = require('../src/index.js');

jest.doMock('axios', () => {
  return {
    post: (url, data) => Promise.resolve({
      data: []
    }),
    get: (url, data) => Promise.resolve({
      data: []
    })
  };
});

jest.doMock('web3', () => {
  return class {};
});

jest.doMock('truffle-hdwallet-provider', () => {
  return class {};
});

jest.doMock('truffle-contract', () => {
  return (contract) => {
    let instance = {};
    for (let i in contract.abi) {
      if (contract.abi[i].type === 'function') {
        let resp = {};
        for (let o in contract.abi[i].outputs) {
          if (contract.abi[i].outputs[o].name === '' && contract.abi[i].outputs[o].type === 'bool') {
            resp = false;
          }
        }
        instance[contract.abi[i].name] = () => Promise.resolve(resp);
      }
    }
    return {
      setProvider: (provider) => Promise.resolve({}),
      deployed: () => Promise.resolve(instance)
    };
  };
});


describe('contract integration', () => {
  beforeAll(() => {});

  test('rrr', async () => {
    expect(true).toEqual(true);
  });

  /*
  test('test user is register', async () => {
    expect.assertions(1);
    const sdk = new DavSDK('0x4fFCe6A06CB4317a295acaDdbb3141c73158f954', '0x4fFCe6A06CB4317a295acaDdbb3141c73158f954', 'solar wild tide always display engage virtual jacket choose shaft bread group term raccoon filter');
    await expect(sdk.isRegistered()).resolves.toEqual(false);
  }); */

/*
  test('test registerSimple', async () => {
    expect.assertions(3);
    const sdk = new DavSDK('0xCE71a46b6837e474def0c1B244868e8b7307F51b', '0xCE71a46b6837e474def0c1B244868e8b7307F51b', 'solar wild tide always display engage virtual jacket choose shaft bread group term raccoon filter');
    await expect(sdk.isRegistered()).resolves.toEqual(false);
    await expect(sdk.registerSimple()).resolves.toEqual(true);
    await expect(sdk.isRegistered()).resolves.toEqual(true);
  }); */

});
