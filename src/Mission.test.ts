import Config from './Config';
import Mission from './Mission';
import SendMessageParams from './SendMessageParams';
import Identity from './Identity';

describe('Mission class', () => {

  const configuration = new Config({});

  beforeAll(() => { /**/ });

  describe('sendMessage method', () => {
    beforeAll(() => { /**/ });

    xit('should success, validate kafka mock send message', async () => {
      const mission = new Mission('selfId', 'peerId', new Identity('id', 'davId', configuration), configuration);
      await mission.sendMessage('type', 'content', new SendMessageParams());
      // validate kafka mock called with send message method
    });

    xit('should fail due to kafka exception', async () => {
      const mission = new Mission('selfId', 'peerId', new Identity('id', 'davId', configuration), configuration);
      expect(await mission.sendMessage('type', 'content', new SendMessageParams())).toThrow('kafka exception');
    });
  });

  describe('messages method', () => {
    beforeAll(() => { /**/ });

    xit('should success', () => {
      const mission = new Mission('selfId', 'peerId', new Identity('id', 'davId', configuration), configuration);
      mission.messages();
    });
  });

  describe('finalizeMission method', () => {
    beforeAll(() => { /**/ });

    xit('should success', async () => {
      const mission = new Mission('selfId', 'peerId', new Identity('id', 'davId', configuration), configuration);
      await mission.finalizeMission('walletPrivateKey');
    });

    xit('should fail due to blockchain exception', async () => {
      const mission = new Mission('selfId', 'peerId', new Identity('id', 'davId', configuration), configuration);
      expect(await mission.finalizeMission('walletPrivateKey')).toThrow('blockchain excpetion');
    });

    xit('should fail due to invalid private key', async () => {
      const mission = new Mission('selfId', 'peerId', new Identity('id', 'davId', configuration), configuration);
      expect(await mission.finalizeMission('invalid walletPrivateKey')).toThrow('invalid private key excpetion');
    });
  });

});
