import SDKFactory from './SDKFactory';

describe('Message class', () => {

  let sdk;

  beforeAll(() => {
    sdk = SDKFactory({});
  });

  describe('respond method', () => {
    beforeAll(() => { /**/ });

    it('should send a message', async () => {
      expect(await sdk.Message.respond('messageType', 'messagePayload')).toBe(false);
    });
  });

});
