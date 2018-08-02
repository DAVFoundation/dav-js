import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Price from './Price';
import { PriceType, MessageStatus, MessageDomain } from './common-enums';
import { DavID, ID } from './common-types';
import MessageParams from './drone-charging/MessageParams';
import IConfig from './IConfig';

describe('Bid class', () => {
  const config = new Config({});
  jest.doMock('./drone-charging/BidParams');
  const bidParams = new BidParams({
    price: new Price('3', PriceType.flat),
    vehicleId: '34',
  });
  const messageParams = new MessageParams({
    status: MessageStatus.accepted,
    domain: MessageDomain.bid,
  });

  describe('accept method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
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
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      try {
        bid.accept(messageParams);
      } catch (error) {
        /** */
      }
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
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      try {
        bid.accept(messageParams);
      } catch (error) {
        /** */
      }
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
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      try {
        bid.accept(messageParams);
      } catch (error) {
        /** */
      }
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
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      try {
        bid.accept(messageParams);
      } catch (error) {
        /** */
      }
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
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);

      try {
        bid.accept(messageParams);
      } catch (error) {
        /** */
      }
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

  xdescribe('messages method', () => {
    beforeAll(() => { /**/ });

    // it('should success', () => {
    //   const bid = new Bid('needId', 'needTypeId', bidParams, config);
    //   // Initialize bid
    //   // mock accept, because messages method had to be called after bid has topic Id
    //   bid.messages();
    // });

    // it('should throw due to absence of topic creation', () => {
    //   const bid = new Bid('needId', 'needTypeId', bidParams, config);
    //   // Initialize bid
    //   expect(bid.messages()).toThrow('no topic to listen for');
    // });
  });
});
