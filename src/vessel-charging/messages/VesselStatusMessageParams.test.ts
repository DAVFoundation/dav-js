import MessageParams from './VesselStatusMessageParams';

describe('MessageParams class', () => {
  const messageParams = new MessageParams({
    location: {
      lat: 32.050382,
      long: 34.766149,
    },
  });

  const serializedMessageParams: any = {
    senderId: undefined,
    protocol: 'vessel_charging',
    ttl: undefined,
    type: 'vessel_status_message',
    location: { lat: 32.050382, long: 34.766149 },
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
