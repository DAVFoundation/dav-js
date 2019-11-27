import MessageParams from './DeclineMessageParams';

describe('DeclineMessageParams class', () => {
  let declineMessageParams: MessageParams;
  let serializedMessageParams: any;

  beforeEach(() => {
    declineMessageParams = new MessageParams({});
    serializedMessageParams = {
      ttl: undefined,
      protocol: 'drone_charging',
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
    it('should return a MessageParams instance', () => {
      const declineMessageObj = new MessageParams();
      declineMessageObj.deserialize(serializedMessageParams);
      expect(declineMessageObj).toBeInstanceOf(MessageParams);
    });

    it('should return a correct MessageParams object', () => {
      const declineMessageObj = new MessageParams({});
      declineMessageObj.deserialize(serializedMessageParams);
      expect(declineMessageObj).toEqual(declineMessageParams);
    });
  });
});
