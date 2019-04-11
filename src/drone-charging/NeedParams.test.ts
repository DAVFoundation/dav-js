import NeedParams from './NeedParams';

describe('NeedParams class', () => {
  let needParams: NeedParams;
  let serializedNeedParams: any;

  beforeEach(() => {
    needParams = new NeedParams({
      davId: undefined,
      location: {
        lat: undefined,
        long:undefined
      }
    });

    serializedNeedParams = {
        ttl: undefined,
      protocol: 'drone_charging',
      type: 'need',
      location: {
        lat: undefined,
        long:undefined
      },
      davId: undefined,
      id: undefined
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
