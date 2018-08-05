import Bid from './Bid';
import Config from './Config';
import BidParams from './drone-delivery/BidParams';
import Mission from './Mission';
import { MessageStatus, MessageDomain } from './common-enums';
import MessageParams from './drone-charging/MessageParams';

describe('Message class', () => {

  const configuration = new Config({});
  const bidParams = new BidParams({});
  const bid = new Bid('needId', 'needTypeId', bidParams, configuration);
  const mission = new Mission('selfId', 'peerId', 'davId', bid, configuration);
  const messageContent = new MessageParams({status: MessageStatus.accepted});
  beforeAll(() => {
    /**/
  });

  describe('respond method', () => {
    const kafkaError = { msg: 'KAFKA_ERROR' };

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should success, validate kafka mock send message', async () => {
      const kafkaMock = {
        sendParams: () => Promise.resolve(true),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));
      // tslint:disable-next-line:variable-name
      const Message: any = (await import('./Message')).default;
      const message = new Message('selfId', 'peerId', bid, mission, messageContent, configuration);
      await expect(message.respond(new MessageParams({}))).resolves.toBeDefined();
    });

    it('should fail due to kafka exception', async () => {
      const kafkaMock = {
        sendParams: () => Promise.reject(kafkaError),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));
      // tslint:disable-next-line:variable-name
      const Message: any = (await import('./Message')).default;
      const message = new Message('selfId', 'peerId', bid, mission, messageContent, configuration);
      await expect(message.respond(new MessageParams({}))).rejects.toBe(kafkaError);
    });

    it('should call to Kafka sendParams', async () => {
      const kafkaMock = {
        sendParams: jest.fn((params) => Promise.resolve(true)),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));
      // tslint:disable-next-line:variable-name
      const Message: any = (await import('./Message')).default;
      const message = new Message('selfId', 'peerId', bid, mission, messageContent, configuration);
      const messageParams = new MessageParams({});
      await message.respond(messageParams);
      expect(kafkaMock.sendParams).toHaveBeenCalledWith('peerId', messageParams, configuration);
    });

    it('should call to Kafka sendParams with message params that contain selfId', async () => {
      const kafkaMock = {
        sendParams: jest.fn((params) => Promise.resolve(true)),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));
      // tslint:disable-next-line:variable-name
      const Message: any = (await import('./Message')).default;
      const selfId = 'selfId';
      const message = new Message(selfId, 'peerId', bid, mission, messageContent, configuration);
      const messageParams = new MessageParams({});
      await message.respond(messageParams);
      expect(kafkaMock.sendParams.mock.calls[0][1].sourceId).toBe(selfId);
    });

  });
});
