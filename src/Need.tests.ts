import { SDKFactory } from '../samples/core';

describe('Need class', () => {

  let sdk;
  let need;

  beforeAll(() => {
    sdk = SDKFactory({});
    need = new sdk.Need({needParams: 'needParams'});
  });

  describe('createBid method', () => {
    beforeAll(() => { /**/ });

    it('should return Bid', async () => {
      expect(await need.createBid('1000000', 5000, {bidParams: 'bidParams'})).toBe(false);
    });
  });

  describe('bids method', () => {
    beforeAll(() => { /**/ });

    it('should subscribe for new bids', async () => {
      expect(await need.bids()).toBe(false);
    });
  });

});
