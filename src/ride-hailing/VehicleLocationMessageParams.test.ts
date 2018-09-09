import MessageParams from './VehicleLocationMessageParams';

describe('MessageParams class', () => {
  const messageParams = new MessageParams({
    vehicleLocation: {
      lat: 32.050382,
      long: 34.766149,
    },
    senderId: 'id',
  });
  const serializedMessageParams: any = {
    missionStatus: 'on_the_way',
    protocol: 'ride_hailing',
    senderId: 'id',
    ttl: undefined,
    type: 'vehicle_location_message',
    vehicleLocation: { lat: 32.050382, long: 34.766149 },
  };

  describe('serialize method', () => {
    it('should return serialized need params object with the current values', () => {
      expect(messageParams.serialize()).toEqual(serializedMessageParams);
    });
  });

  describe('deserialize method', () => {
    it('should return NeedParams instance with the current parameters', () => {
      const messageParamsObject = new MessageParams();
      messageParamsObject.deserialize(serializedMessageParams);
      expect(messageParamsObject).toEqual(messageParams);
    });
  });

});
