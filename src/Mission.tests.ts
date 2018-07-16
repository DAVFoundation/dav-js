import { SDKFactory } from '../samples/core';

describe('Mission class', () => {

  let sdk;
  let mission;

  beforeAll(() => {
    sdk = SDKFactory({});
    mission = new sdk.Mission({needParams: 'needParams'})
  });

  describe('sendMessage method', () => {
    beforeAll(() => { /**/ });

    it('should send a message', async () => {
      expect(await mission.sendMessage('messagesType', 'messagesPayload', {params: 'ISendMessageParams'})).toBe(false);
    });
  });

  describe('messages method', () => {
    beforeAll(() => { /**/ });

    it('should subscribe for new messages', async () => {
      expect(await mission.messages()).toBe(false);
    });
  });

  describe('finalizeMission method', () => {
    beforeAll(() => { /**/ });

    it('should complete the mission', async () => {
      expect(await mission.finalizeMission('walletPrivateKey')).toBe(false);
    });
  });

});
