import { log } from 'handlebars';
import Config from './Config';

describe('Contracts class', () => {

  // TODO: unless there is a very good reason - don't use common variables inb tests
  const configuration = new Config({});

  beforeAll(() => { /**/ });

  describe('isIdentityRegistered method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should return true for registered Id', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory(true);
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(await contracts.isIdentityRegistered('REGISTERED_ADDRESS', configuration)).toEqual(true);
    });

    /*     it('should return false for unregistered Id', async () => {
          jest.doMock('web3', async () => {
            const web3Factory = require('./__mocks__/web3');
            web3Factory(false);
            // TODO: Why is the test done inside the factory method?
            expect(await Contracts.isIdentityRegistered('UNREGISTERED_ADDRESS', configuration)).toEqual(false);
          });
        });
     */
  });

  // describe('registerIdentity method', () => {
  //   beforeAll(() => { /**/ });

  // });

});
