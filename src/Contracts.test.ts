jest.mock('web3');

import Contracts from './Contracts';
import Config from './Config';

describe('Contracts class', () => {

  const configuration = new Config({});

  beforeAll(() => { /**/ });

  describe('isIdentityRegistered method', () => {
    beforeAll(() => { /**/ });

    it('should return true for registered Id', async () => {
        expect(await Contracts.isIdentityRegistered('REGISTERED_ADDRESS', configuration)).toEqual(true);
    });

    it('should return false for unregistered Id', async () => {
        expect(Contracts.isIdentityRegistered('UNREGISTERED_ADDRESS', configuration)).resolves.toEqual(false);
    });

  });

  describe('registerIdentity method', () => {
    beforeAll(() => { /**/ });

  });

});
