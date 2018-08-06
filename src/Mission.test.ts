import Config from './Config';
import MessageParams from './drone-charging/MessageParams';
import Bid from './Bid';
import BidParams from './drone-charging/BidParams';
import { PriceType } from './common-enums';
import Price from './Price';
import { Observable } from './common-types';
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
      // tslint:disable-next-line:variable-name
      const Mission: any = (await import('./Mission')).default;
      const mission = new Mission('selfId', 'peerId', 'davId', bid, configuration);
      await expect(mission.sendMessage(new MessageParams({}))).resolves.toBeDefined();
    });

    it('should fail due to kafka exception', async () => {
      const kafkaMock = {
        sendParams: () => Promise.reject(kafkaError),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));
      // tslint:disable-next-line:variable-name
      const Mission: any = (await import('./Mission')).default;
      const mission = new Mission('selfId', 'peerId', 'davId', bid, configuration);
      await expect(mission.sendMessage(new MessageParams({}))).rejects.toBe(kafkaError);
    });

    it('should call to Kafka sendParams', async () => {
      const kafkaMock = {
        sendParams: jest.fn((params) => Promise.resolve(true)),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));
      // tslint:disable-next-line:variable-name
      const Mission: any = (await import('./Mission')).default;
      const mission = new Mission('selfId', 'peerId', 'davId', bid, configuration);
      const messageParams = new MessageParams({});
      await mission.sendMessage(messageParams);
      expect(kafkaMock.sendParams).toHaveBeenCalledWith('peerId', messageParams, configuration);
    });
  });

  describe('messages method', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should receive message events', async () => {

      const messageParams1 = new MessageParams({senderId: 'SOURCE_ID_1'});
      const messageParams2 = new MessageParams({senderId: 'SOURCE_ID_2'});
      const messageParams3 = new MessageParams({senderId: 'SOURCE_ID_3'});
      jest.doMock('./Kafka', () => ({
          default: { paramsStream: async () => Observable.from([
            messageParams1, messageParams2, messageParams3,
          ]),
        },
      }));
      // tslint:disable-next-line:variable-name
      const Mission: any = (await import('./Mission')).default;
      const mission = new Mission('selfId', 'peerId', 'davId', bid, configuration);
      const spy = jest.fn();
      const messages = await mission.messages();
      messages.subscribe(spy);
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual(new Message('selfId', bid, mission, messageParams1, configuration));
      expect(spy.mock.calls[1][0]).toEqual(new Message('selfId', bid, mission, messageParams2, configuration));
      expect(spy.mock.calls[2][0]).toEqual(new Message('selfId', bid, mission, messageParams3, configuration));
    });

    it('should receive error event', async () => {
      jest.doMock('./Kafka', () => ({
          default: { paramsStream: async () => Observable.fromPromise(Promise.reject(kafkaError)) },
      }));

      // tslint:disable-next-line:variable-name
      const Mission: any = (await import('./Mission')).default;
      const mission = new Mission('selfId', 'peerId', 'davId', bid, configuration);
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
      // tslint:disable-next-line:variable-name
      const Mission: any = (await import('./Mission')).default;
      const mission = new Mission('selfId', 'peerId', 'davId', bid, configuration);
      await expect(mission.finalizeMission(WALLET_PRIVATE_KEY)).resolves.toBe(transactionReceipt);
    });

    it('should fail due to blockchain exception', async () => {
      const web3Error = { msg: 'WEB3_ERROR' };
      const contractsMock = {
        finalizeMission: () => Promise.reject(web3Error),
      };
      jest.doMock('./Contracts', () => ({ default: contractsMock }));
      // tslint:disable-next-line:variable-name
      const Mission: any = (await import('./Mission')).default;
      const mission = new Mission('selfId', 'peerId', 'davId', bid, configuration);
      await expect(mission.finalizeMission(WALLET_PRIVATE_KEY)).rejects.toBe(web3Error);
    });
  });

});
