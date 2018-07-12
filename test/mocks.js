/* eslint-disable no-unused-vars */

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
