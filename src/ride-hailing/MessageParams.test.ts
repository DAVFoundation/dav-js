import MessageParams from './MessageParams';

describe('MessageParams class', () => {
  let messageParams: MessageParams;
  let serializedMessageParams: any;

  beforeEach(() => {
    messageParams = new MessageParams({
      senderId: undefined,
    });

    serializedMessageParams = {
      missionStatus: undefined,
      protocol: 'ride_hailing',
      type: 'message',
      senderId: undefined,
      ttl: undefined,
    };
  });

  describe('serialize method', () => {
    it('should return serialized MessageParams object with the current values', () => {
      expect(messageParams.serialize()).toEqual(serializedMessageParams);
    });
  });

  describe('deserialize method', () => {
    it('should return a MessageParms instance', () => {
      const messageParamsObject = new MessageParams();
      messageParamsObject.deserialize(serializedMessageParams);
      expect(messageParamsObject).toBeInstanceOf(MessageParams);
    });

    it('should return deserialize MessageParams instance with the current parameters', () => {
      const messageParamsObject = new MessageParams();
      messageParamsObject.deserialize(serializedMessageParams);
      expect(messageParamsObject).toEqual(messageParams);
    });
  });
});
