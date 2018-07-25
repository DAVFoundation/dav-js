import Contracts from './Contracts';
import Config from './Config';

describe('Contracts class', () => {

  // TODO: unless there is a very good reason - don't use common variables inb tests
  const configuration = new Config({});

  beforeAll(() => { /**/ });

  describe('isIdentityRegistered method', () => {
    beforeEach( async () => {
      await jest.unmock('web3');
    });

    it('should return true for registered Id', async () => {
      jest.doMock('web3', async () => {
        const web3Factory = require('./__mocks__/web3');
        web3Factory(true);
        // TODO: Why is the test done inside the factory method?
        expect(await Contracts.isIdentityRegistered('REGISTERED_ADDRESS', configuration)).toEqual(true);
      });
    });

    it('should return false for unregistered Id', async () => {
      jest.doMock('web3', async () => {
        const web3Factory = require('./__mocks__/web3');
        web3Factory(false);
        // TODO: Why is the test done inside the factory method?
        expect(await Contracts.isIdentityRegistered('UNREGISTERED_ADDRESS', configuration)).toEqual(false);
      });
    });

  });

  // describe('registerIdentity method', () => {
  //   beforeAll(() => { /**/ });

  // });

});
