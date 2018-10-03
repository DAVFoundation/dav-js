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
    // testing for instance
    it('should return a MessageParams instance', () => {
      const declineMessageObj = new MessageParams();
      declineMessageObj.deserialize(serializedMessageParams);
      expect(declineMessageObj).toBeInstanceOf(MessageParams);
    });

    // testing for object content
    it('should return a correct MessageParams object', () => {
      const declineMessageObj = new MessageParams({});
      declineMessageObj.deserialize(serializedMessageParams);
      expect(declineMessageObj).toEqual(declineMessageParams);
    });
  });
});
