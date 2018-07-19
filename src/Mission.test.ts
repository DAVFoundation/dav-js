import Config from './Config';
import Mission from './Mission';
import SendMessageParams from './SendMessageParams';

describe('Mission class', () => {

  const configuration = new Config({});

  beforeAll(() => { /**/ });

  describe('sendMessage method', () => {
    beforeAll(() => { /**/ });

    it('should success, validate kafka mock send message', async () => {
      const mission = new Mission('selfId', 'peerId', configuration);
      await mission.sendMessage('type', 'content', new SendMessageParams());
      // validate kafka mock called with send message method
    });

    it('should fail due to kafka exception', async () => {
      const mission = new Mission('selfId', 'peerId', configuration);
      expect(await mission.sendMessage('type', 'content', new SendMessageParams())).toThrow('kafka exception');
    });
  });

  describe('messages method', () => {
    beforeAll(() => { /**/ });

    it('should success', () => {
      const mission = new Mission('selfId', 'peerId', configuration);
      mission.messages();
    });
  });

  describe('finalizeMission method', () => {
    beforeAll(() => { /**/ });

    it('should success', async () => {
      const mission = new Mission('selfId', 'peerId', configuration);
      await mission.finalizeMission('walletPrivateKey');
    });

    it('should fail due to blockchain exception', async () => {
      const mission = new Mission('selfId', 'peerId', configuration);
      expect(await mission.finalizeMission('walletPrivateKey')).toThrow('blockchain excpetion');
    });

    it('should fail due to invalid private key', async () => {
      const mission = new Mission('selfId', 'peerId', configuration);
      expect(await mission.finalizeMission('invalid walletPrivateKey')).toThrow('invalid private key excpetion');
    });
  });

});
