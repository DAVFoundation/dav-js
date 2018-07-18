import Config from './Config';
import Need from './Need';

describe('Need class', () => {

  const configuration = new Config();
  const need = new Need('id', 'needTypeId', configuration);

  beforeAll(() => { /**/ });

  describe('createBid method', () => {
    beforeAll(() => { /**/ });

    it('should return Bid', async () => {
      expect(await need.createBid('1000000', 5000, {})).toBe(false);
    });
  });

  describe('bids method', () => {
    beforeAll(() => { /**/ });

    it('should subscribe for new bids', async () => {
      expect(await need.bids()).toBe(false);
    });
  });

});
