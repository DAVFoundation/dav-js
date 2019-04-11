import NeedParams from './NeedParams';

describe('NeedParams class', () => {
  const needParams = new NeedParams({
    pickupLocation: {
      lat: 32.050382,
      long: 34.766149,
    },
    location: {
      lat: 32.050382,
      long: 34.766149,
    },
    destinationLocation: {
      lat: 32.050782,
      long: 34.768149,
    },
  });
  needParams.id = 'TOPIC_ID';
  needParams.davId = 'davId';
  const serializedNeedParams: any = {
    ttl: undefined,
    protocol: 'ride_hailing',
    type: 'need',
    id: 'TOPIC_ID',
    pickupLocation: {
      lat: 32.050382,
      long: 34.766149,
    },
    location: {
      latitude: 32.050382,
      longitude: 34.766149,
    },
    destinationLocation: {
      lat: 32.050782,
      long: 34.768149,
    },
    davId: 'davId',
  };

  describe('serialize method', () => {
    it('must return a JSON object that contains all properties defined in the NeedParams instance', () => {
      expect(needParams.serialize()).toEqual(serializedNeedParams);
    });
  });

  describe('deserialize method', () => {
    it('must initialize all the properties of the NeedParams instance with the values provided in the JSON string', () => {
      const needParamsObject = new NeedParams();
      needParamsObject.deserialize(serializedNeedParams);
      expect(needParamsObject).toEqual(needParams);
    });
  });
});
