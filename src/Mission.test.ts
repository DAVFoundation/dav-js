import Config from './Config';
import Mission from './Mission';
import MessageParams from './drone-charging/MessageParams';
import Identity from './Identity';

describe('Mission class', () => {

  const configuration = new Config({});

  beforeAll(() => { /**/ });

  describe('sendMessage method', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    xit('should success, validate kafka mock send message', async () => {
      const kafkaFactory = require('./mocks/Kafka');
      jest.doMock('Kafka', () => {
        return kafkaFactory({
          createTopicResolve: true,
        });
      });
      // const mission = new Mission('selfId', 'peerId', 'davId', configuration);
      // await mission.sendMessage('type', 'content', new MessageParams({}));
      // validate kafka mock called with send message method
    });

    xit('should fail due to kafka exception', async () => {
      // const mission = new Mission('selfId', 'peerId', 'davId', configuration);
      // expect(await mission.sendMessage('type', 'content', new MessageParams({}))).toThrow('kafka exception');
    });
  });

  describe('messages method', () => {
    beforeAll(() => { /**/ });

    xit('should success', () => {
      // const mission = new Mission('selfId', 'peerId', 'davId', configuration);
      // mission.messages();
    });
  });

  describe('finalizeMission method', () => {
    beforeAll(() => { /**/ });

    xit('should success', async () => {
      // const mission = new Mission('selfId', 'peerId', 'davId', configuration);
      // await mission.finalizeMission('walletPrivateKey');
    });

    xit('should fail due to blockchain exception', async () => {
      // const mission = new Mission('selfId', 'peerId', 'davId', configuration);
      // expect(await mission.finalizeMission('walletPrivateKey')).toThrow('blockchain exception');
    });

    xit('should fail due to invalid private key', async () => {
      // const mission = new Mission('selfId', 'peerId', 'davId', configuration);
      // expect(await mission.finalizeMission('invalid walletPrivateKey')).toThrow('invalid private key exception');
    });
  });

});
