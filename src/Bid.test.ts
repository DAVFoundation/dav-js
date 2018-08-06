import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Price from './Price';
import { PriceType, MessageStatus, MessageDomain } from './common-enums';
import { DavID, ID } from './common-types';
import MessageParams from './drone-charging/MessageParams';
import IConfig from './IConfig';
import { Observable } from 'rxjs';

describe('Bid class', () => {
  const config = new Config({});
  jest.doMock('./drone-charging/BidParams');
  let bidParams = new BidParams({
    price: new Price('3', PriceType.flat),
    vehicleId: '34',
  });
  let messageParams = new MessageParams({
    status: MessageStatus.accepted,
    domain: MessageDomain.bid,
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    bidParams = new BidParams({
      price: new Price('3', PriceType.flat),
      vehicleId: '34',
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
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      await expect(bid.accept(messageParams)).resolves.toBeUndefined();

      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
      expect(kafkaMock.sendParams).toHaveBeenCalledWith('needId', messageParams, config);
    });

    it('should throw due to topic creation failure', async () => {
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.reject('error')),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      await expect(bid.accept(messageParams)).rejects.toBe('error');

      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
    });

    it('should throw due to message send failure', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.resolve()),
        sendParams: jest.fn((needId: string, mParams: MessageParams, configParam: IConfig) => Promise.reject('error')),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      // Act + Assert
      await expect(bid.accept(messageParams)).rejects.toBe('error');
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
      expect(kafkaMock.sendParams).toHaveBeenCalledWith('needId', messageParams, config);
    });
  });

  describe('signContract method', () => {

    it('should not throw any errors when get valid input and no errors', async () => {
      const contractsMock = {
        approveMission: jest.fn((dav: DavID, key: string, configParam: IConfig) => Promise.resolve('')),
        startMission: jest.fn((missionId: ID, dav: DavID, key: string, vId: DavID, price: string, configParam: IConfig) => Promise.resolve('')),
      };
      jest.doMock('./Contracts', () => ({default: contractsMock}));
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: () => Promise.resolve(),
        sendParams: () => Promise.resolve(),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      await bid.accept(messageParams);
      const privateKey = 'valid private key';
      const davId = 'davId';

      const mission = await bid.signContract(privateKey, davId);


      expect(mission.selfId).toBe('topicId');
      expect(mission.peerId).toBe('needTypeId');
      expect(mission.neederDavId).toBe(davId);

      expect(contractsMock.approveMission).toHaveBeenCalledWith(davId, privateKey, config);
      expect(contractsMock.startMission).toHaveBeenCalledWith(expect.any(String), davId, privateKey, '34', '3', config);
    });

    it('should throw due to invalid input', async () => {
      const contractsMock = {
        approveMission: jest.fn((dav: DavID, key: string, configParam: IConfig) => Promise.reject('error')),
        startMission: jest.fn((missionId: ID, dav: DavID, key: string, vId: DavID, price: string, configParam: IConfig) => Promise.resolve('')),
      };
      jest.doMock('./Contracts', () => ({default: contractsMock}));
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: () => Promise.resolve(),
        sendParams: () => Promise.resolve(),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      await bid.accept(messageParams);

      const privateKey = 'invalid private key';
      const davId = 'davId';

      await expect(bid.signContract(privateKey, davId)).rejects.toBe('error');

      expect(contractsMock.approveMission).toHaveBeenCalledWith(davId, privateKey, config);
      expect(contractsMock.startMission).toHaveBeenCalledTimes(0);
    });

    it('should throw due topic id undefined - validate return value', async () => {
      // Arrange;
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      const privateKey = 'invalid private key';
      const davId = 'davId';

      // Act + Assert
      await expect(bid.signContract(privateKey, davId)).rejects.toEqual(new Error('Cannot sign on contract before bid is accepted'));
    });
  });

  describe('messages method', () => {

    it('should get one message when get valid input and no errors', async () => {
      const kafkaMock = {
        generateTopicId: () => 'topicId',
        createTopic: () => Promise.resolve(),
        sendParams: () => Promise.resolve(),
        paramsStream: jest.fn((topicId: string, configParam: IConfig) => Promise.resolve(Observable.from([messageParams]))),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      const contractsMock = {
        approveMission: () => Promise.resolve(),
        startMission: () => Promise.resolve(),
      };
      jest.doMock('./Contracts', () => ({default: contractsMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      await bid.accept(messageParams);
      await bid.signContract('privateKey', 'davId');

      const messagesStream = await bid.messages();

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
      expect(message.selfId).toBe('topicId');
      expect(message.messageParams.domain).toBe(MessageDomain.bid);
      expect(message.messageParams.status).toBe(MessageStatus.accepted);

      expect(kafkaMock.paramsStream).toHaveBeenCalledWith('topicId', config);
    });

    it('should throw because paramsStream is throwing', async () => {
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
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      await bid.accept(messageParams);
      await bid.signContract('privateKey', 'davId');

      await expect(bid.messages()).rejects.toEqual('kafka error');
      expect(kafkaMock.paramsStream).toHaveBeenCalledWith('topicId', config);
    });

    it('should throw because topic id is undefined', async () => {
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      await expect(bid.messages()).rejects
      .toEqual(new Error('No messages available, please accept the bid, and sign the contract before you try to get messages'));
    });

    it('should throw because mission is undefined', async () => {
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: () => Promise.resolve(),
        sendParams: () => Promise.resolve(),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      await bid.accept(messageParams);

      await expect(bid.messages()).rejects
      .toEqual(new Error('No messages available, please accept the bid, and sign the contract before you try to get messages'));
    });
  });
});
