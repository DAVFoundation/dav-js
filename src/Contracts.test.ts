import Config from './Config';
import { ContractTypes } from './common-enums';

describe('Contracts class', () => {

  const configuration = new Config({});
  const transactionReceipt = { transactionHash: 'TRANSACTION_HASH' };
  const web3Error = { msg: 'WEB3_ERROR' };
  const REGISTERED_IDENTITY = 'REGISTERED_IDENTITY';
  const UNREGISTERED_IDENTITY = 'UNREGISTERED_IDENTITY';
  const WALLET_PRIVATE_KEY = 'WALLET_PRIVET_KEY';
  const IDENTITY_PRIVATE_KEY = 'IDENTITY_PRIVET_KEY';
  const WALLET_ADDRESS = 'WALLET_ADDRESS';
  const VEHICLE_ID = 'VEHICLE_ID';
  const MISSION_ID = 'MISSION_ID';
  const MISSION_PRICE = '1000000';

  const bitOfTime = () => {
    return new Promise((resolve, reject) => {
      jest.useRealTimers();
      setTimeout(resolve, 0);
      jest.useFakeTimers();
    });
  };
  beforeAll(() => { /**/ });

  describe('isIdentityRegistered method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should return true for registered Id', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: true,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.isIdentityRegistered(REGISTERED_IDENTITY, configuration)).resolves.toBe(true);
    });

    it('should return false for unregistered Id', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.isIdentityRegistered(UNREGISTERED_IDENTITY, configuration)).resolves.toBe(false);

    });
  });

  describe('registerIdentity method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should return ALREADY_REGISTERED for registered Id', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: true,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.registerIdentity(REGISTERED_IDENTITY,
        IDENTITY_PRIVATE_KEY,
        WALLET_ADDRESS,
        WALLET_PRIVATE_KEY,
        configuration)).resolves.toEqual('ALREADY_REGISTERED');
    });

    it('should return transaction receipt for unregistered Id', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionSuccess: (type: string, cb: any) => cb(transactionReceipt),
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.registerIdentity(UNREGISTERED_IDENTITY,
        IDENTITY_PRIVATE_KEY,
        WALLET_ADDRESS,
        WALLET_PRIVATE_KEY,
        configuration)).resolves.toBe(transactionReceipt.transactionHash);
    });

    it('should throw some web3 error', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionError: (type: string, cb: any) => cb(web3Error),
          sendSignedTransactionSuccess: (type: string, cb: any) => false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.registerIdentity(UNREGISTERED_IDENTITY,
        IDENTITY_PRIVATE_KEY,
        WALLET_ADDRESS,
        WALLET_PRIVATE_KEY,
        configuration)).rejects.toBe(web3Error);
    });
  });

  describe('approveMission method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should return transaction receipt', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionSuccess: (type: string, cb: any) => cb(transactionReceipt),
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.approveMission(REGISTERED_IDENTITY,
        WALLET_PRIVATE_KEY,
        configuration)).resolves.toBe(transactionReceipt);
    });

    it('should throw some web3 error', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionError: (type: string, cb: any) => cb(web3Error),
          sendSignedTransactionSuccess: (type: string, cb: any) => false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.approveMission(REGISTERED_IDENTITY,
        WALLET_PRIVATE_KEY,
        configuration)).rejects.toBe(web3Error);
    });
  });

  describe('startMission method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should return transaction receipt', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionSuccess: (type: string, cb: any) => cb(transactionReceipt),
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.startMission(MISSION_ID,
        REGISTERED_IDENTITY,
        WALLET_PRIVATE_KEY,
        VEHICLE_ID,
        MISSION_PRICE,
        configuration)).resolves.toBe(transactionReceipt);
    });

    it('should throw some web3 error', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionError: (type: string, cb: any) => cb(web3Error),
          sendSignedTransactionSuccess: (type: string, cb: any) => false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.startMission(MISSION_ID,
        REGISTERED_IDENTITY,
        WALLET_PRIVATE_KEY,
        VEHICLE_ID,
        MISSION_PRICE,
        configuration)).rejects.toBe(web3Error);
    });
  });

  describe('finalizeMission method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should return start mission transaction receipt', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionSuccess: (type: string, cb: any) => cb(transactionReceipt),
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.finalizeMission(MISSION_ID,
        REGISTERED_IDENTITY,
        WALLET_PRIVATE_KEY,
        configuration)).resolves.toBe(transactionReceipt);
    });

    it('should throw some web3 error', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionError: (type: string, cb: any) => cb(web3Error),
          sendSignedTransactionSuccess: (type: string, cb: any) => false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      await expect(contracts.finalizeMission(MISSION_ID,
        REGISTERED_IDENTITY,
        WALLET_PRIVATE_KEY,
        configuration)).rejects.toBe(web3Error);
    });
  });

  describe('watchContract method', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      jest.useFakeTimers();
    });

    // TODO: test fails
    xit('should receive contract events', async () => {
      const pastEvent1 = [{ transactionHash: 'TRANSACTION_HASH_1' }];
      const pastEvent2 = [{ transactionHash: 'TRANSACTION_HASH_2' }];
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        const getPastEvents = jest.fn();
        getPastEvents
          .mockReturnValueOnce(pastEvent1)
          .mockReturnValue(pastEvent2);

        return web3Factory({
          getPastEvents,
        });
      });
      const spy = jest.fn();
      const contracts: any = (await import('./Contracts')).default;
      const observable = contracts.watchContract(REGISTERED_IDENTITY, ContractTypes.basicMission, configuration);
      observable.subscribe(spy);
      jest.advanceTimersByTime(10000);
      await bitOfTime();
      expect(spy.mock.calls.length).toBe(2);
      expect(spy.mock.calls[0][0]).toEqual(pastEvent1);
      expect(spy.mock.calls[1][0]).toEqual(pastEvent2);
    });

    it('should receive contract error events', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        const getPastEvents = jest.fn(() => Promise.reject(web3Error));
        return web3Factory({
          getPastEvents,
        });
      });
      const spy = jest.fn();
      const contracts: any = (await import('./Contracts')).default;
      const observable = contracts.watchContract(REGISTERED_IDENTITY, ContractTypes.basicMission, configuration);
      observable.subscribe(spy, (err: any) => {
        expect(err).toEqual(web3Error);
      });
      jest.advanceTimersByTime(10000);
      await bitOfTime();
      expect(spy).not.toHaveBeenCalled();
    });

  });
});
