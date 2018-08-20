import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Price from './Price';
import { PriceType, MessageStatus, MessageDomain } from './common-enums';
import { DavID, ID, BigInteger } from './common-types';
import MessageParams from './drone-charging/MessageParams';
import MissionParams from './drone-charging/MissionParams';
import IConfig from './IConfig';
import { Observable } from 'rxjs';
import Mission from './Mission';

describe('Bid class', () => {
  const config = new Config({});
  const selfId = 'SELF_ID';
  jest.doMock('./drone-charging/BidParams');
  let bidParams = new BidParams({
    price: new Price('3', PriceType.flat),
    vehicleId: '34',
  });
  let messageParams = new MessageParams({
    status: MessageStatus.accepted,
    domain: MessageDomain.bid,
  });
  const missionParams = new MissionParams({
    id: 'MISSION_ID',
    neederDavId: 'DAV_ID',
    vehicleId: 'DAV_ID',
    price: '100',
  });
  const kafkaError = { msg: 'Kafka error' };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    bidParams = new BidParams({
      id: 'BID_TOPIC_ID',
      price: new Price('3', PriceType.flat),
      vehicleId: '34',
      needTypeId: 'TOPIC_ID',
    });
    messageParams = new MessageParams({
      status: MessageStatus.accepted,
      domain: MessageDomain.bid,
    });
  });

  describe('accept method', () => {

    it('should not throw any errors when get valid input and no errors', async () => {
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.resolve()),
        sendParams: jest.fn((needId: string, mParams: MessageParams, configParam: IConfig) => Promise.resolve()),
      };
      const contractsMock = {
        approveMission: jest.fn(() => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      jest.doMock('./Contracts', () => ({default: contractsMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid(selfId, bidParams, config);

      await expect(bid.accept(missionParams, 'Private_key')).resolves.toEqual(new Mission(missionParams.id, missionParams, config));

      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
      expect(kafkaMock.sendParams).toHaveBeenCalledWith(bidParams.needTypeId, missionParams, config);
    });

    it('should throw due to topic creation failure', async () => {
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.reject(kafkaError)),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid(selfId, bidParams, config);

      await expect(bid.accept(missionParams, 'Private_key')).rejects.toThrow(`Fail to create a topic: ${kafkaError}`);

      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
    });

    it('should throw due to message send failure', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.resolve()),
        sendParams: jest.fn((needId: string, mParams: MessageParams, configParam: IConfig) => Promise.reject(kafkaError)),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', bidParams, config);
      await expect(bid.accept(missionParams, 'Private_key')).rejects.toBe(kafkaError);
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
      expect(kafkaMock.sendParams).toHaveBeenCalledWith(bidParams.needTypeId, missionParams, config);
    });
  });

  describe('messages method', () => {

    it('should get one message when get valid input and no errors', async () => {
      const kafkaMessageStreamMock = {
        filterType: jest.fn(() => Observable.from([messageParams])),
      };
      const kafkaMock = {
        messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
      };
      jest.doMock('./KafkaMessageStream', () => ({
        default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
      }));
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid(selfId, bidParams, config);
      const messagesStream = await bid.messages(MessageParams);
      const message = await new Promise<any>((resolve, reject) => {
        messagesStream.subscribe(
          (next) => {
            resolve(next);
          },
          (error) => {
            reject(error);
          },
        );
      });
      expect(message.selfId).toBe(selfId);
      expect(kafkaMock.messages).toHaveBeenCalledWith(bidParams.id, config);
    });

    xit('should throw because paramsStream is throwing', async () => {
      const kafkaMock = {
        generateTopicId: () => 'topicId',
        createTopic: () => Promise.resolve(),
        sendParams: () => Promise.resolve(),
        paramsStream: jest.fn((topicId: string, configParam: IConfig) => Promise.reject('kafka error')),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      const contractsMock = {
        approveMission: () => Promise.resolve(),
        startMission: () => Promise.resolve(),
      };
      jest.doMock('./Contracts', () => ({default: contractsMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid(selfId, bidParams, config);
      // await expect(bid.messages()).rejects.toEqual('kafka error');
      expect(kafkaMock.paramsStream).toHaveBeenCalledWith(bidParams.id, config);
    });
  });

  describe('sendMessage method', () => {

    const kafkaMock = {
      sendParams: jest.fn(() => Promise.resolve()),
    };
    beforeAll(() => {
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
    });

    it('should success and call relevant function', async () => {
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid(selfId, bidParams, config);
      await expect(bid.sendMessage(messageParams)).resolves.toBeUndefined();
      expect(kafkaMock.sendParams).toHaveBeenCalledWith(bidParams.id, messageParams, config);
    });

    it('should throw because topic id == selfId', async () => {
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid(bidParams.id, bidParams, config);
      await expect(bid.sendMessage(messageParams)).rejects.toThrow('You cannot send message to your own channel');
    });
  });

});
