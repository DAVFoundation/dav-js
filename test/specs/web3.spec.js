const { davJS } = require('../../src/index');
const web3 = require('../../src/web3wrapper');

describe('contract integration', () => {

  // const account;
  // const PK;
  beforeAll(() => {
    process.env.MISSION_CONTROL_URL = 'http://localhost:8888';
    // process.env.BLOCKCHAIN_TYPE = 'ETH_LOCAL_TESTNET';
    process.env.NODE_ENV = 'development';
  });

  test('test user register flow', async () => {
    expect.assertions(1);
    let davId, wallet;
    if(web3.isConnected()) {
      davId = web3.eth.accounts[0];
      wallet = web3.eth.accounts[0];
    }
    const dav = new davJS(davId, wallet);
    await expect(dav.register()).resolves.toEqual(true);
  });
});
