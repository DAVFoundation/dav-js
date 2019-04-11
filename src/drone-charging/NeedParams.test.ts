import NeedParams from './NeedParams';

describe('NeedParams class', () => {
  let needParams: NeedParams;
  let serializedNeedParams: any;

  beforeEach(() => {
    needParams = new NeedParams({
      davId: undefined,
      location: {
        lat: 32.050382,
        long: 34.766149,
      }
    });

    serializedNeedParams = {
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
      davId: undefined,
      protocol: 'drone_charging',
      ttl: undefined,
      type: 'need_filter',
    };
  });

  describe('serialize method', () => {
    it('should return serialized NeedParams object with the current values', () => {
      expect(needParams.serialize()).toEqual(serializedNeedParams);
    });
  });

  describe('deserialize method', () => {
    it('should return a NeedParams instance', () => {
      const needParamsObject = new NeedParams();
      needParamsObject.deserialize(serializedNeedParams);
      expect(needParamsObject).toBeInstanceOf(NeedParams);
    });

    it('should return deserialize NeedParams instance with the current parameters', () => {
      const needParamsObject = new NeedParams();
      needParamsObject.deserialize(serializedNeedParams);
      expect(needParamsObject).toEqual(needParams);
    });
  });
});
