import { BidParams } from './drone-charging';
import { SDKFactory, PriceType } from './core';
import * as DroneDelivery from './drone-delivery';

describe('SDK class', () => {
  beforeAll(() => { /**/ });

  describe('isRegistered method', () => {
    beforeAll(() => { /**/ });

    it('should return false', async () => {
      const sdk = SDKFactory({});
      expect(await sdk.isRegistered('')).toBe(false);
    });
  });
});
