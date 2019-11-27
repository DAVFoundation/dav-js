import BidParams from './BidParams';
import { EnergySources } from './enums';

describe('BidParams class', () => {
  const bidParams = new BidParams({
    id: 'BID_TOPIC_ID',
    price: '100000000000000000',
    vehicleId: 'DAV_ID',
    entranceLocation: {
      lat: 32.050382,
      long: 34.766149,
    },
    exitLocation: {
      lat: 32.050382,
      long: 34.766149,
    },
    availableFrom: 1535441613658,
    availableUntil: 1535441623658,
    energySource: EnergySources.Hydro,
    isCommitted: true,
    neederDavId: 'davId',
  });
  const serializedBidParams: any = {
    amenities: undefined,
    provider: undefined,
    model: undefined,
    manufacturer: undefined,
    ttl: undefined,
    protocol: 'drone_charging',
    type: 'bid',
    id: 'BID_TOPIC_ID',
    price: ['100000000000000000'],
    vehicleId: 'DAV_ID',
    entranceLocation: {
      lat: 32.050382,
      long: 34.766149,
    },
    exitLocation: {
      lat: 32.050382,
      long: 34.766149,
    },
    availableFrom: 1535441613658,
    availableUntil: 1535441623658,
    energySource: 'hydro',
    isCommitted: true,
    neederDavId: 'davId',
  };

  describe('serialize method', () => {
    it('should return serialized bid params object with the current values', () => {
      expect(bidParams.serialize()).toEqual(serializedBidParams);
    });
  });
  describe('deserialize method', () => {
    it('should return BidParams instance with the current parameters', () => {
      const bidParamsObject = new BidParams();
      bidParamsObject.deserialize(serializedBidParams);
      expect(bidParamsObject).toEqual(bidParams);
    });
  });
});
