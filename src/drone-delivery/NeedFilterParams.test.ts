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
        dimensions: undefined,
        protocol: 'drone_delivery',
        type: 'need_filter',
        ttl: undefined,
      };
    });

    describe('serialize method', () => {
        it('should return serialized NeedFilterParams object with the current values', () => {
          expect(needFilterParams.serialize()).toEqual(serializedNeedFilterParams);
        });
      });

    describe('deserialize method', () => {
        it('should return a NeedFilterParams instance', () => {
          const needFilterParamsObject = new NeedFilterParams();
          needFilterParamsObject.deserialize(serializedNeedFilterParams);
          expect(needFilterParamsObject).toBeInstanceOf(NeedFilterParams);
        });

        it('should return deserialize NeedFilterParams instance with current parameters', () => {
          const needFilterParamsObject = new NeedFilterParams();
          needFilterParamsObject.deserialize(serializedNeedFilterParams);
          expect(needFilterParamsObject).toEqual(needFilterParams);
        });
      });
    });
