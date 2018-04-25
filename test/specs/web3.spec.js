jest.doMock('axios', () => {
  return {
    post: (url, data) => Promise.resolve({ data: []}), // eslint-disable-line no-unused-vars
    get: (url, data) => Promise.resolve({ data: [] }) // eslint-disable-line no-unused-vars
  };
});

const { DavSDK } = require('dav-js');
const mnemonic = require('./mnemonic');


describe('contract integration', () => {

  beforeAll(() => {
    process.env.NODE_ENV = 'development';
    process.env.ETH_NODE_URL = 'https://ropsten.infura.io/wUiZtmeZ1KwjFrcC8zRO';
  });

  test('test user register flow', async () => {
    expect.assertions(1);
    const sdk = new DavSDK('0x4fFCe6A06CB4317a295acaDdbb3141c73158f954', '0x4fFCe6A06CB4317a295acaDdbb3141c73158f954', mnemonic);
    await expect(sdk.isRegistered()).resolves.toEqual(false);
  });
});
