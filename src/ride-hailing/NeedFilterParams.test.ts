import NeedFilterParams from './NeedFilterParams';

describe('NeedFilterParams class', () => {
  let needFilterParams: NeedFilterParams;
  let needFilterParamsTest: NeedFilterParams;
  let serializedNeedFilterParams: any;
  let serializedNeedFilterParamsTest: any;

  beforeEach(() => {
    needFilterParams = new NeedFilterParams({
      location: {
        lat: 32.050382,
        long: 34.766149,
      },
      radius: 2000,
    });

    needFilterParamsTest = new NeedFilterParams({
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

    serializedNeedFilterParamsTest = {
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

  describe('serialize method', () => {
    it('should return serialized object', () => {
      // test objects
      console.log('serialized object', needFilterParamsTest.serialize());
      console.log('test serialized object', serializedNeedFilterParamsTest);
      // test object equal check
      console.log('triple equal: ',
        needFilterParamsTest.serialize() === serializedNeedFilterParamsTest);
      console.log('expect toEqual: ',
        expect(needFilterParamsTest.serialize()).toEqual(serializedNeedFilterParamsTest));
      // non test object equal check
      console.log('non-tester triple equal: ',
        needFilterParams.serialize() === serializedNeedFilterParams);
      console.log('non-tester expect toEqual: ',
        expect(needFilterParams.serialize()).toEqual(serializedNeedFilterParams));

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
