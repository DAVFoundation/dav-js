import Contracts from './Contracts';
import Config from './Config';

describe('Contracts class', () => {

  const configuration = new Config({});

  beforeAll(() => { /**/ });

  describe('isIdentityRegistered method', () => {
    beforeAll(() => { /**/ });

    it('should return true for registered Id', async () => {
        expect(Contracts.isIdentityRegistered('0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6', configuration)).resolves.toEqual(true);
    });

    it('should return false for unregistered Id', async () => {
        expect(Contracts.isIdentityRegistered('0xCE71a46b6837e474def0c1B244868e8b7307F51b', configuration)).resolves.toEqual(false);
    });

  });

  describe('registerIdentity method', () => {
    beforeAll(() => { /**/ });

  });

});
