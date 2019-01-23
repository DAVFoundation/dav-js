import NeedParams from './NeedParams';
import VehicleTypes from './VehicleTypes';

describe('NeedParams class', () => {
  let needParams: NeedParams;
  let serializedNeedParams: any;

  beforeEach(() => {
    needParams = new NeedParams({
      endLocation: {
        lat: 32.050382,
        long: 34.766149,
      },
      location: {
        lat: 32.050382,
        long: 34.766149,
      },
      maxAltitude: 6000,
      startAt: undefined,
      startLocation: {
        lat: 32.050382,
        long: 34.766149,
      },
      vehicleType: VehicleTypes.drone,
    });

    serializedNeedParams = {
      davId: undefined,
      endLocation: {
        lat: 32.050382,
        long: 34.766149,
      },
      id: undefined,
      location: {
        latitude: 32.050382,
        longitude: 34.766149,
      },
      maxAltitude: 6000,
      protocol: 'drone_delivery',
      startLocation: {
        lat: 32.050382,
        long: 34.766149,
      },
      type: 'need',
      ttl: undefined,
      vehicleType: VehicleTypes.drone,
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

    it('should return deserialize NeedParams instance with current parameters', () => {
      const needParamsObject = new NeedParams();
      needParamsObject.deserialize(serializedNeedParams);
      expect(needParamsObject).toEqual(needParams);
    });
  });
});
