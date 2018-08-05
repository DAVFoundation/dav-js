import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Price from './Price';
import { PriceType } from './common-enums';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import { Observable } from './common-types';

describe('Need class', () => {

  const config = new Config({});
  let bidParams = new BidParams({price: new Price('3', PriceType.flat)});
  bidParams.sourceId = 'bidSource';

  describe('createBid method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      bidParams = new BidParams({price: new Price('3', PriceType.flat)});
      bidParams.sourceId = 'bidSource';
    });

    it('should create correct bid when input is valid', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configObject: IConfig) => Promise.resolve()),
        sendParams: jest.fn((topicId: string, params: BasicParams, configObject: IConfig) => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Need = (await import('./Need')).default;
      const need = new Need('id', 'needTypeId', config);

      // Act
      const bid = await need.createBid(bidParams);

      // Assert
      expect(bid.needId).toBe('id');
      expect(bid.needTypeId).toBe('needTypeId');
      expect(bid.params.sourceId).toBe('topicId');
      expect(bid.params.price.value).toBe('3');
      expect(bid.params.price.type).toBe(PriceType.flat);

      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
      expect(kafkaMock.sendParams).toHaveBeenCalledWith('topicId', bidParams, config);
    });

    it('should throw exception when createTopic throws error', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configObject: IConfig) => Promise.reject('kafka error')),
        sendParams: jest.fn((topicId: string, params: BasicParams, configObject: IConfig) => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Need = (await import('./Need')).default;
      const need = new Need('id', 'needTypeId', config);

      // Act + Assert
      await expect(need.createBid(bidParams)).rejects.toEqual('kafka error');

      // Assert
      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
      expect(kafkaMock.sendParams).toHaveBeenCalledTimes(0);
    });

    it('should throw exception when sendParams throws error', async () => {
      // Arrange
      const kafkaMock = {
        generateTopicId: jest.fn(() => 'topicId'),
        createTopic: jest.fn((topicId: string, configObject: IConfig) => Promise.resolve()),
        sendParams: jest.fn((topicId: string, params: BasicParams, configObject: IConfig) => Promise.reject('kafka error')),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Need = (await import('./Need')).default;
      const need = new Need('id', 'needTypeId', config);

      // Act + Assert
      await expect(need.createBid(bidParams)).rejects.toEqual('kafka error');

      // Assert
      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
      expect(kafkaMock.sendParams).toHaveBeenCalledWith('topicId', bidParams, config);
    });
  });

  describe('bids method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      bidParams = new BidParams({price: new Price('3', PriceType.flat)});
      bidParams.sourceId = 'bidSource';
    });

    it('should create bid observable with one message', async (done) => {
      // Arrange
      const kafkaMock = {
        paramsStream: jest.fn((topicId: string, configObject: IConfig) => Promise.resolve(Observable.from([bidParams]))),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Need = (await import('./Need')).default;
      const need = new Need('id', 'needTypeId', config);

      // Act
      const bids = await need.bids();

      // Assert
      bids.subscribe((next) => {
        expect(kafkaMock.paramsStream).toHaveBeenCalledWith('id', config);
        expect(next.needId).toBe('id');
        expect(next.needTypeId).toBe('bidSource');
        expect(next.params.price.value).toBe('3');
        expect(next.params.price.type).toBe(PriceType.flat);
        done();
      });
    });

    it('should throw error when paramsStream throws error', async () => {
      // Arrange
      const kafkaMock = {
        paramsStream: jest.fn((topicId: string, configObject: IConfig) => Promise.reject('kafka error')),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Need = (await import('./Need')).default;
      const need = new Need('id', 'needTypeId', config);

      // Act + Assert
      await expect(need.bids()).rejects.toEqual('kafka error');

      // Assert
      expect(kafkaMock.paramsStream).toHaveBeenCalledWith('id', config);
    });
  });

});
