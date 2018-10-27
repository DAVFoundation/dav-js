import BidParams from './BidParams';

describe('BidParams class', () => {
  let bidParams: BidParams;
  let serializedBidParams: any;

  beforeEach(() => {
    bidParams = new BidParams({
      id: 'TOPIC_ID',
      price: ['66666666'],
      vehicleId: 'VEHICLE_DAV_ID',
      neederDavId: 'CONSUMER_DAV_ID',
      isCommitted: true,
      plugType: undefined,
    });

    serializedBidParams = {
      ttl: undefined,
      protocol: 'drone_charging',
      type: 'bid',
      id: 'TOPIC_ID',
      price: ['66666666'],
      vehicleId: 'VEHICLE_DAV_ID',
      neederDavId: 'CONSUMER_DAV_ID',
      isCommitted: true,
      plugType: undefined,
    };
  });

  describe('serialize method', () => {
    it('should return serialized BidParams object with the current values', () => {
      expect(bidParams.serialize()).toEqual(serializedBidParams);
    });
  });

  describe('deserialize method', () => {
    it('should return deserialize BidParams instance with the current parameters', () => {
      const bidParamsObject = new BidParams();
      bidParamsObject.deserialize(serializedBidParams);
      expect(bidParamsObject).toEqual(bidParams);
    });
  });
});
