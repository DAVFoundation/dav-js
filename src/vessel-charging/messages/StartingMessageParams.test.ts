import MessageParams from './StartingMessageParams';

describe('StartingMessageParams class', () => {
  let startingMessageParams: MessageParams;
  let serializedMessageParams: any;

  beforeEach(() => {
    startingMessageParams = new MessageParams({});
    serializedMessageParams = {
      ttl: undefined,
      protocol: 'vessel_charging',
      type: 'starting_message',
      senderId: undefined,
    };
  });

  describe('serialize method', () => {
    it('should return serialized message params object with the current values', () => {
      expect(startingMessageParams.serialize()).toEqual(
        serializedMessageParams,
      );
    });
  });

  describe('deserialize method', () => {
    it('should return a MessageParams instance', () => {
      const startingMessageObj = new MessageParams();
      startingMessageObj.deserialize(serializedMessageParams);
      expect(startingMessageObj).toBeInstanceOf(MessageParams);
    });

    it('should return a correct MessageParams object', () => {
      const startingMessageObj = new MessageParams({});
      startingMessageObj.deserialize(serializedMessageParams);
      expect(startingMessageObj).toEqual(startingMessageParams);
    });
  });
});
