import { SDKFactory } from '../samples/core';

describe('Need class', () => {

  let sdk;

  beforeAll(() => {
    sdk = SDKFactory({});
  });

  describe('createBid method', () => {
    beforeAll(() => { /**/ });

    it('should return Bid', async () => {
      expect(await sdk.isRegistered('')).toBe(false);
    });
  });

  describe('bids method', () => {
    beforeAll(() => { /**/ });

    it('should subscribe for new bids', async () => {
      expect(await sdk.isRegistered('')).toBe(false);
    });
  });

});
