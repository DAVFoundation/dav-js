import NeedFilterParams from './NeedFilterParams';

describe('NeedFilterParams class', () => {
  const needFilterParams = new NeedFilterParams({
    location: {
      lat: 32.050382,
      long: 34.766149,
    },
    radius: 2000,
  });
  needFilterParams.davId = 'davId';
  const serializedNeedFilterParams: any = {
    ttl: undefined,
    protocol: 'ride_hailing',
    type: 'need_filter',
    area: {
      max: {
        latitude: parseFloat((32.06836666390769).toFixed(6)),
        longitude: parseFloat((34.78737405278662).toFixed(6)),
      },
      min: {
        latitude: parseFloat((32.03239380095659).toFixed(6)),
        longitude: parseFloat((34.74493228891106).toFixed(6)),
      },
    },
    davId: 'davId',
  };

  describe('serialize method', () => {
    it('should return serialized need params object with the current values', () => {
      expect(needFilterParams.serialize()).toEqual(serializedNeedFilterParams);
    });
  });

  describe('deserialize method', () => {
    it('should return NeedParams instance with the current parameters', () => {
      const needParamsObject = new NeedFilterParams();
      needParamsObject.deserialize(serializedNeedFilterParams);
      expect(needParamsObject).toEqual(needFilterParams);
    });
  });
});
