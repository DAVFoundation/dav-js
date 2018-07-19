import Config from './Config';
import Need from './Need';

describe('Need class', () => {

  const configuration = new Config();
  const need = new Need('id', 'needTypeId', {}, configuration);

  beforeAll(() => { /**/ });

  describe('createBid method', () => {
    beforeAll(() => { /**/ });

    it('should create valid Bid with properties: {}', async () => {
      const bid = await need.createBid('1000000', 5000, {});
      // check each bid public property validity in a separate test
    });
  });

  describe('bids method', () => {
    beforeAll(() => { /**/ });

    it('should subscribe for new bids', async () => {
      expect(await need.bids()).toBe(false);
    });
  });

});
