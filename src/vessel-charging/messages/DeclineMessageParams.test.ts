import MessageParams from './DeclineMessageParams';

describe('DeclineMessageParams class', () => {
  let declineMessageParams: MessageParams;
  let serializedMessageParams: any;

  beforeEach(() => {
    declineMessageParams = new MessageParams({});
    serializedMessageParams = {
      ttl: undefined,
      protocol: 'vessel_charging',
      type: 'decline_message',
      senderId: undefined,
    };
  });

  describe('serialize method', () => {
    it('should return serialized message params object with the current values', () => {
      expect(declineMessageParams.serialize()).toEqual(serializedMessageParams);
    });
  });

  describe('deserialize method', () => {
    it('should return deserialized message params with the current parameters', () => {
      const declineMessageObj = new MessageParams({});
      declineMessageObj.deserialize(serializedMessageParams);
      expect(declineMessageObj).toEqual(declineMessageParams);
    });
  });
});
