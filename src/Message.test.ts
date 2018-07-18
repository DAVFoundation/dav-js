import Message from './Message';
import Config from './Config';

describe('Message class', () => {

  const configuration = new Config();
  const message = new Message('selfId', 'peerId', configuration);

  beforeAll(() => {
    /**/
  });

  describe('respond method', () => {
    beforeAll(() => { /**/ });

    it('should send a message', async () => {
      expect(await message.respond('messageType', 'messagePayload')).toBe(false);
    });
  });

});
