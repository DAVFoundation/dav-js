import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Price from './Price';
import { PriceType } from './common-enums';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import { Observable } from './common-types';
import MessageParams from './drone-charging/MessageParams';
import Bid from './Bid';

describe('Need class', () => {

  const config = new Config({});
  let bidParams = new BidParams({price: new Price('3', PriceType.flat)});
  bidParams.bidderId = 'bidSource';

  describe('createBid method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      bidParams = new BidParams({price: new Price('3', PriceType.flat)});
      bidParams.bidderId = 'bidSource';
    });

    it('should create correct bid when input is valid', async () => {
      const kafkaMock = {
        sendParams: jest.fn((topicId: string, params: BasicParams, configObject: IConfig) => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Need = (await import('./Need')).default;
      const need = new Need('id', config);

      // Act
      const bid = await need.createBid(bidParams);

      expect(bid.needId).toBe('id');
      expect(bid.needTypeId).toBe('bidSource');
      expect(bid.params.price.value).toBe('3');
      expect(bid.params.price.type).toBe(PriceType.flat);

      expect(kafkaMock.sendParams).toHaveBeenCalledWith('id', bidParams, config);
    });

    it('should throw exception when sendParams throws error', async () => {
      const kafkaMock = {
        sendParams: jest.fn((topicId: string, params: BasicParams, configObject: IConfig) => Promise.reject('kafka error')),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Need = (await import('./Need')).default;
      const need = new Need('id', config);

      await expect(need.createBid(bidParams)).rejects.toEqual('kafka error');

      expect(kafkaMock.sendParams).toHaveBeenCalledWith('id', bidParams, config);
    });
  });

  describe('bids method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      bidParams = new BidParams({price: new Price('3', PriceType.flat)});
      bidParams.bidderId = 'bidSource';
    });

    it('should create bid observable with one message', async () => {
      const kafkaMock = {
        paramsStream: jest.fn((topicId: string, configObject: IConfig) => Promise.resolve(Observable.from([bidParams]))),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Need = (await import('./Need')).default;
      const need = new Need('id', config);

      const bids = await need.bids();

      const bidMessage = await new Promise<any>((resolve, reject) => {
          bids.subscribe(
          (next) => resolve(next),
          (error) => reject(error),
        );
      });
      expect(kafkaMock.paramsStream).toHaveBeenCalledWith('id', config);
      expect(bidMessage.needId).toBe('id');
      expect(bidMessage.needTypeId).toBe('bidSource');
      expect(bidMessage.params.price.value).toBe('3');
      expect(bidMessage.params.price.type).toBe(PriceType.flat);
    });

    it('should throw error when paramsStream throws error', async () => {
      const kafkaMock = {
        paramsStream: jest.fn((topicId: string, configObject: IConfig) => Promise.reject('kafka error')),
      };
      jest.doMock('./Kafka', () => ({default: kafkaMock}));
      // tslint:disable-next-line:variable-name
      const Need = (await import('./Need')).default;
      const need = new Need('id', config);

      await expect(need.bids()).rejects.toEqual('kafka error');

      expect(kafkaMock.paramsStream).toHaveBeenCalledWith('id', config);
    });
  });

});
