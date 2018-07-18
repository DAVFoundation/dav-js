import Config from './Config';
import Mission from './Mission';

describe('Mission class', () => {

  const configuration = new Config();

  beforeAll(() => { /**/ });

  describe('sendMessage method', () => {
    beforeAll(() => { /**/ });

    it('should send a message', async () => {
      const mission = new Mission('selfId', 'peerId', configuration);
      expect(mission.sendMessage('messagesType', 'messagesPayload', {})).toBe(false);
    });
  });

  describe('messages method', () => {
    beforeAll(() => { /**/ });

    it('should subscribe for new messages', async () => {
      const mission = new Mission('selfId', 'peerId', configuration);
      expect(mission.messages()).toBe(false);
    });
  });

  describe('finalizeMission method', () => {
    beforeAll(() => { /**/ });

    it('should complete the mission', async () => {
      const mission = new Mission('selfId', 'peerId', configuration);
      expect(mission.finalizeMission('walletPrivateKey')).toBe(false);
    });
  });

});
