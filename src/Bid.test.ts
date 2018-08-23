import Config from './Config';
import BidParams from './ride-hailing/BidParams';
import Price from './Price';
import MessageParams from './drone-charging/MessageParams';
import MissionParams from './drone-charging/MissionParams';
import IConfig from './IConfig';
import { Observable } from 'rxjs';
import Mission from './Mission';
import { PriceType } from './common-enums';

describe('Bid class', () => {
  const config = new Config({});
  const selfId = 'SELF_ID';
  jest.doMock('./ride-hailing/BidParams');
  let bidParams = new BidParams({
    price: new Price('3', PriceType.flat),
    vehicleId: '34',
  });
  let messageParams = new MessageParams({
    senderId: 'sender',
  });
  const missionParams = new MissionParams({
    id: 'MISSION_ID',
    neederDavId: 'DAV_ID',
    vehicleId: 'DAV_ID',
    price: '100',
  });
  const kafkaError = { msg: 'Kafka error' };

  const forContextSwitch = () => {
    return new Promise((resolve, reject) => {
      jest.useRealTimers();
      setTimeout(resolve, 0);
      jest.useFakeTimers();
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    bidParams = new BidParams({
      id: 'BID_TOPIC_ID',
      price: new Price('3', PriceType.flat),
      vehicleId: '34',
    });
    messageParams = new MessageParams({
      senderId: 'sender',
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
      expect(kafkaMock.sendParams).toHaveBeenCalledWith(bidParams.id, missionParams, config);
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
      expect(kafkaMock.sendParams).toHaveBeenCalledWith(bidParams.id, missionParams, config);
    });
  });

  describe('missions method', () => {

    const missionParams1 = new MissionParams({
      id: 'MISSION_ID_1',
      neederDavId: 'DAV_ID',
      vehicleId: 'DAV_ID',
      price: '100',
    });
    const missionParams2 = new MissionParams({
      id: 'MISSION_ID_2',
      neederDavId: 'DAV_ID',
      vehicleId: 'DAV_ID',
      price: '100',
    });
    const missionParams3 = new MissionParams({
      id: 'MISSION_ID_3',
      neederDavId: 'DAV_ID',
      vehicleId: 'DAV_ID',
      price: '100',
    });

    const axiosMock = {
      post: jest.fn(() => Promise.resolve()),
    };

    const TOPIC_ID = 'TOPIC_ID';

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      jest.resetModules();
      jest.doMock('axios', () => ({
        default: axiosMock,
      }));
    });

    it('should receive missions and call relevant functions', async () => {

      const kafkaMessageStreamMock = {
        filterType: jest.fn(() => Observable.from([missionParams1,  missionParams2, missionParams3])),
      };
      const kafkaMock = {
        generateTopicId: jest.fn(() => TOPIC_ID),
        createTopic: jest.fn(() => Promise.resolve()),
        messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
      };
      jest.doMock('./KafkaMessageStream', () => ({
        default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
      }));
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));

      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid(TOPIC_ID, bidParams, config);
      const spy = jest.fn();
      const missions = await bid.missions(MissionParams);
      missions.subscribe(spy);
      await forContextSwitch();
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual(new Mission(TOPIC_ID, missionParams1, config));
      expect(spy.mock.calls[1][0]).toEqual(new Mission(TOPIC_ID, missionParams2, config));
    });


    it('should receive missions with specified topicId and relevant functions', async () => {

      const kafkaMessageStreamMock = {
        filterType: jest.fn(() => Observable.from([missionParams1,  missionParams2, missionParams3])),
      };
      const kafkaMock = {
        generateTopicId: jest.fn(() => TOPIC_ID),
        createTopic: jest.fn(() => Promise.resolve()),
        messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
      };
      jest.doMock('./KafkaMessageStream', () => ({
        default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
      }));
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));

      const anotherTopic = 'anotherTopic';
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid(anotherTopic, bidParams, config);
      const spy = jest.fn();
      const missions = await bid.missions(MissionParams);
      missions.subscribe(spy);
      await forContextSwitch();
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual(new Mission(anotherTopic, missionParams1, config));
      expect(spy.mock.calls[1][0]).toEqual(new Mission(anotherTopic, missionParams2, config));
      expect(kafkaMock.generateTopicId).not.toHaveBeenCalled();
      expect(kafkaMock.createTopic).not.toHaveBeenCalled();
    });

    xit('should receive Kafka error event', async () => {
      // kafkaMock.paramsStream.mockImplementation(() => Promise.resolve(Observable.fromPromise(Promise.reject(kafkaError))));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', bidParams, config);
      const successSpy = jest.fn();
      const errorSpy = jest.fn();
      const missions = await bid.missions(MissionParams);
      missions.subscribe(successSpy, errorSpy);
      await forContextSwitch();
      expect(successSpy.mock.calls.length).toBe(0);
      expect(errorSpy.mock.calls.length).toBe(1);
      expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
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
      expect(kafkaMock.messages).toHaveBeenCalledWith(selfId, config);
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
