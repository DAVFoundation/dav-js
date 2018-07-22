import Contracts from './Contracts';
import Config from './Config';

describe('Need class', () => {

  const configuration = new Config({});

  beforeAll(() => { /**/ });

  describe('isRegistered method', () => {
    beforeAll(() => { /**/ });

    it('should return false for unregistered Id', async () => {
        expect(await Contracts.isIdentityRegistered('Valid Unregistered Dav Id', configuration)).resolves.toEqual(false);
    });

    it('should return false for registered Id', async () => {
        expect(await Contracts.isIdentityRegistered('Valid Registered Dav Id', configuration)).resolves.toEqual(true);
    });

  });

  describe('registerIdentity method', () => {
    beforeAll(() => { /**/ });

  });

});
