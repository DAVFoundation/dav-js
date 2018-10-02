import NeedFilterParams from './NeedFilterParams';

describe('NeedFilterParams class', () => {
  let needFilterParams: NeedFilterParams;
  let serializedNeedFilterParams: any;

  beforeEach(() => {
    needFilterParams = new NeedFilterParams({
      location: {
        lat: 32.050382,
        long: 34.766149,
      },
      radius: 2000,
    });

    serializedNeedFilterParams = {
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
    };
  });

  describe('deserialize method', () => {
    it('should return NeedParams instance with the current parameters', () => {
      const needParamsObject = new NeedFilterParams();
      needParamsObject.deserialize(serializedNeedFilterParams);
      expect(needParamsObject).toEqual(needFilterParams);
    });
  });
});
