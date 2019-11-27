import MessageParams from './ChargingCompleteMessageParams';

describe('MessageParams class', () => {
  let messageParams: MessageParams;
  let serializedMessageParams: any;

  beforeEach(() => {
    messageParams = new MessageParams({
      senderId: 'TOPIC_ID',
    });

    serializedMessageParams = {
      ttl: undefined,
      protocol: 'drone_charging',
      type: 'charging_complete_message',
      senderId: 'TOPIC_ID',
    };
  });

  describe('serialize method', () => {
    it('should return serialized message params object with the current values', () => {
      expect(messageParams.serialize()).toEqual(serializedMessageParams);
    });
  });

  describe('deserialize method', () => {
    it('should return a MessageParams instance', () => {
      const messageParamsObject = new MessageParams();
      messageParamsObject.deserialize(serializedMessageParams);
      expect(messageParamsObject).toBeInstanceOf(MessageParams);
    });

    it('should return the correct deserialized parameters', () => {
      const messageParamsObject = new MessageParams();
      messageParamsObject.deserialize(serializedMessageParams);
      expect(messageParamsObject).toEqual(messageParams);
    });
  });
});
