import Config from './Config';
import MessageParams from './drone-charging/MessageParams';
import Bid from './Bid';
import BidParams from './drone-charging/BidParams';
import { PriceType } from './common-enums';
import Price from './Price';
import IConfig from './IConfig';
import { Observable } from './common-types';
import { Observer } from 'rxjs';
import message from './Message';
import Message from './Message';

describe('Mission class', () => {

  const configuration = new Config({});
  const bidParams = new BidParams({
    price: new Price('3', PriceType.flat),
    vehicleId: '34',
  });
  const bid = new Bid('needId', 'needTypeId', bidParams, configuration);
  const kafkaError = { msg: 'KAFKA_ERROR' };
  const forContextSwitch = () => {
    return new Promise((resolve, reject) => {
      jest.useRealTimers();
      setTimeout(resolve, 0);
      jest.useFakeTimers();
    });
  };

  beforeAll(() => { /**/ });

  describe('sendMessage method', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should success, validate kafka mock send message', async () => {
      const kafkaMock = {
        sendParams: () => Promise.resolve(true),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));
      const missions: any = (await import('./Mission')).default;
      const mission = new missions('selfId', 'peerId', 'davId', bid, configuration);
      await expect(mission.sendMessage('type', 'content', new MessageParams({}))).resolves.toBeDefined();
    });

    it('should fail due to kafka exception', async () => {
      const kafkaMock = {
        sendParams: () => Promise.reject(kafkaError),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));
      const missions: any = (await import('./Mission')).default;
      const mission = new missions('selfId', 'peerId', 'davId', bid, configuration);
      await expect(mission.sendMessage('type', 'content', new MessageParams({}))).rejects.toBe(kafkaError);
    });
  });

  describe('messages method', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should receive message events', async () => {

      const messageParams1 = new MessageParams({sourceId: 'SOURCE_ID_1'});
      const messageParams2 = new MessageParams({sourceId: 'SOURCE_ID_2'});
      const messageParams3 = new MessageParams({sourceId: 'SOURCE_ID_3'});
      jest.doMock('./Kafka', () => ({
          default: { paramsStream: async () => Observable.from([
            messageParams1, messageParams2, messageParams3,
          ]),
        },
      }));
      const missions: any = (await import('./Mission')).default;
      const mission = new missions('selfId', 'peerId', 'davId', bid, configuration);
      const spy = jest.fn();
      const messages = await mission.messages();
      messages.subscribe(spy);
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual(new Message('selfId', 'peerId', bid, mission, messageParams1, configuration));
      expect(spy.mock.calls[1][0]).toEqual(new Message('selfId', 'peerId', bid, mission, messageParams2, configuration));
      expect(spy.mock.calls[2][0]).toEqual(new Message('selfId', 'peerId', bid, mission, messageParams3, configuration));
    });

    it('should receive error event', async () => {
      jest.doMock('./Kafka', () => ({
          default: { paramsStream: async () => Observable.fromPromise(Promise.reject(kafkaError)) },
      }));

      const missions: any = (await import('./Mission')).default;
      const mission = new missions('selfId', 'peerId', 'davId', bid, configuration);
      const successSpy = jest.fn();
      const errorSpy = jest.fn();
      const messages = await mission.messages();
      messages.subscribe(successSpy, errorSpy);
      await forContextSwitch();
      expect(successSpy.mock.calls.length).toBe(0);
      expect(errorSpy.mock.calls.length).toBe(1);
      expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
    });

  });

  describe('finalizeMission method', () => {

    const WALLET_PRIVATE_KEY = 'WALLET_PRIVET_KEY';

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should success with finalize mission transaction receipt', async () => {
      const transactionReceipt = { transactionHash: 'TRANSACTION_HASH' };
      const contractsMock = {
        finalizeMission: () => Promise.resolve(transactionReceipt),
      };
      jest.doMock('./Contracts', () => ({ default: contractsMock }));
      const missions: any = (await import('./Mission')).default;
      const mission = new missions('selfId', 'peerId', 'davId', bid, configuration);
      await expect(mission.finalizeMission(WALLET_PRIVATE_KEY)).resolves.toBe(transactionReceipt);
    });

    it('should fail due to blockchain exception', async () => {
      const web3Error = { msg: 'WEB3_ERROR' };
      const contractsMock = {
        finalizeMission: () => Promise.reject(web3Error),
      };
      jest.doMock('./Contracts', () => ({ default: contractsMock }));
      const missions: any = (await import('./Mission')).default;
      const mission = new missions('selfId', 'peerId', 'davId', bid, configuration);
      await expect(mission.finalizeMission(WALLET_PRIVATE_KEY)).rejects.toBe(web3Error);
    });
  });

});
