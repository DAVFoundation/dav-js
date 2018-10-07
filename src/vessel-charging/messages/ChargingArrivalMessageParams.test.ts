import MessageParams from './ChargingArrivalMessageParams';

describe('ChargingArrivalMessageParams class', () => {
  const chargingArrivalMessageParams = new MessageParams({});

  const serializedMessageParams: any = {
    ttl: undefined,
    protocol: 'vessel_charging',
    type: 'charging_arrival_message',
    senderId: undefined,
  };

  describe('serialize method', () => {
    it('should return serialized message params object with the current values', () => {
      expect(chargingArrivalMessageParams.serialize()).toEqual(
        serializedMessageParams,
      );
    });
  });

  describe('deserialize method', () => {
    it('should return deserialized message params with the current parameters', () => {
      const messageParamsObject = new MessageParams({});
      messageParamsObject.deserialize(serializedMessageParams);
      expect(messageParamsObject).toEqual(chargingArrivalMessageParams);
    });

    it('should return a MessageParams instance', () => {
      const messageParamsObject = new MessageParams({});
      messageParamsObject.deserialize(serializedMessageParams);
      expect(messageParamsObject).toBeInstanceOf(MessageParams);
    });
  });
});
