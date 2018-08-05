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

  describe('accept method', () => {
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

    it('should succeed - check return value resolved', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.resolve()),
        sendParams: jest.fn((needId: string, mParams: MessageParams, configParam: IConfig) => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      // Act + Assert
      await expect(bid.accept(messageParams)).resolves.toBeUndefined();
    });

    it('should succeed - check generateTopicId call', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.resolve()),
        sendParams: jest.fn((needId: string, mParams: MessageParams, configParam: IConfig) => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      // Act
      await bid.accept(messageParams);

      // Assert
      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
    });

    it('should succeed - check createTopic call', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.resolve()),
        sendParams: jest.fn((needId: string, mParams: MessageParams, configParam: IConfig) => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      // Act
      await bid.accept(messageParams);

      // Assert
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
    });

    it('should succeed - check sendParams call', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.resolve()),
        sendParams: jest.fn((needId: string, mParams: MessageParams, configParam: IConfig) => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      // Act
      await bid.accept(messageParams);

      // Assert
      expect(kafkaMock.sendParams).toHaveBeenCalledWith('needId', messageParams, config);
    });

    it('should throw due to topic creation failure - check return value', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.reject('error')),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      // Act + Assert
      await expect(bid.accept(messageParams)).rejects.toBe('error');
    });

    it('should throw due to topic creation failure - check createTopic call', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configParam: IConfig) => Promise.reject('error')),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      // Act + Assert
      try {
        await bid.accept(messageParams);
      } catch (error) {
        /** */
      }

      // Assert
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
    });

    it('should throw due to message send failure - check return value', async () => {
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
    });

    it('should throw due to message send failure - check createTopic call', async () => {
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
      try {
        await bid.accept(messageParams);
      } catch (error) {
        /** */
      }

      // Assert
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
    });

    it('should throw due to message send failure - check sendParams call', async () => {
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

      // Act
      try {
        await bid.accept(messageParams);
      } catch (error) {
        /** */
      }

      // Assert
      expect(kafkaMock.sendParams).toHaveBeenCalledWith('needId', messageParams, config);
    });
  });

  describe('signContract method', () => {
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

    it('should succeed, validate mission object', async () => {
      // Arrange
      const contractsMock = {
        approveMission: () => Promise.resolve(''),
        startMission: () => Promise.resolve(''),
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

      // Act
      const mission = await bid.signContract(privateKey, davId);

      // Assert
      expect(mission.selfId).toBe('topicId');
      expect(mission.peerId).toBe('needTypeId');
      expect(mission.neederDavId).toBe(davId);
    });

    it('should succeed, validate approveMission method', async () => {
      // Arrange
      const approveMissionVerifiable = jest.fn();
      approveMissionVerifiable.mockResolvedValue('');
      const contractsMock = {
        approveMission: (dav: DavID, key: string, configParam: IConfig) => approveMissionVerifiable(dav, key, configParam),
        startMission: () => Promise.resolve(''),
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

      // Act
      const mission = await bid.signContract(privateKey, davId);

      // Assert
      expect(approveMissionVerifiable).toHaveBeenCalledWith(davId, privateKey, config);
    });

    it('should succeed, validate startMission method', async () => {
      // Arrange
      const startMissionVerifiable = jest.fn();
      startMissionVerifiable.mockResolvedValue('');
      const contractsMock = {
        approveMission: () => Promise.resolve(''),
        startMission: (missionId: ID, dav: DavID, key: string, vId: DavID, price: string, configParam: IConfig) =>
         startMissionVerifiable(missionId, dav, key, vId, price, configParam),
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

      // Act
      const mission = await bid.signContract(privateKey, davId);

      // Assert
      expect(startMissionVerifiable).toHaveBeenCalledWith(expect.any(String), davId, privateKey, '34', '3', config);
    });

    it('should throw due to invalid input - check return value', async () => {
      // Arrange
      const contractsMock = {
        approveMission: () => Promise.reject('error'),
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

      // Act + Assert
      await expect(bid.signContract(privateKey, davId)).rejects.toBe('error');
    });

    it('should throw due to invalid input - validate approveMission method', async () => {
      // Arrange
      const approveMissionVerifiable = jest.fn();
      approveMissionVerifiable.mockRejectedValue('error');
      const contractsMock = {
        approveMission: (dav: DavID, key: string, configParam: IConfig) => approveMissionVerifiable(dav, key, configParam),
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

      // Act
      try {
        await bid.signContract(privateKey, davId);
      } catch (error) {
        /** */
      }

      // Assert
      expect(approveMissionVerifiable).toHaveBeenCalledWith(davId, privateKey, config);
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

    it('should success - check message object', async (done) => {
      // Arrange
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

      // Act
      const messagesStream = await bid.messages();

      // Assert
      messagesStream.subscribe(
        (next) => {
          expect(next.selfId).toBe('topicId');
          expect(next.peerId).toBe('needTypeId');
          expect(next.messageParams.domain).toBe(MessageDomain.bid);
          expect(next.messageParams.status).toBe(MessageStatus.accepted);
          done();
        },
        (error) => {
          fail();
          done();
        },
      );
    });

    it('should success - check messages method', async (done) => {
      // Arrange
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

      // Act
      const messagesStream = await bid.messages();

      // Assert
      messagesStream.subscribe(
        (next) => {
          expect(kafkaMock.paramsStream).toHaveBeenCalledWith('topicId', config);
          done();
        },
        (error) => {
          fail();
          done();
        },
      );
    });

    it('should throw because paramsStream is throwing', async () => {
      // Arrange
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

      // Act + Assert
      await expect(bid.messages()).rejects.toEqual('kafka error');
    });

    it('should throw because topic id is undefined', async () => {
      // Arrange
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      // Act + Assert
      await expect(bid.messages()).rejects
      .toEqual(new Error('No messages available, please accept the bid, and sign the contract before you try to get messages'));
    });

    it('should throw because mission is undefined', async () => {
      // Arrange
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

      // Act + Assert
      await expect(bid.messages()).rejects
      .toEqual(new Error('No messages available, please accept the bid, and sign the contract before you try to get messages'));
    });
  });
});
