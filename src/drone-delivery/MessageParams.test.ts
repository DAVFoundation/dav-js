import MessageParams from './MessageParams';

describe('MessageParams class', () => {
  let messageParams: MessageParams;
  let serializedMessageParams: any;

  beforeEach(() => {
    messageParams = new MessageParams({
      senderId: 'SENDER_ID',
    });

    serializedMessageParams = {
      protocol: 'drone_delivery',
      type: 'message',
      senderId: 'SENDER_ID',
      ttl: undefined,
    };
  });

  describe('serialize method', () => {
    it('should return serialized MessageParams object with the current values', () => {
      expect(messageParams.serialize()).toEqual(serializedMessageParams);
    });
  });

  describe('deserialize method', () => {
    it('should return a MessageParams instance', () => {
      const messageParamsObject = new MessageParams();
      messageParamsObject.deserialize(serializedMessageParams);
      expect(messageParamsObject).toBeInstanceOf(MessageParams);
    });

    it('should return deserialize MessageParams instance with current parameters', () => {
      const messageParamsObject = new MessageParams();
      messageParamsObject.deserialize(serializedMessageParams);
      expect(messageParamsObject).toEqual(messageParams);
    });
  });
});
