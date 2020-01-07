import Config from '../Config';
import { ContractTypes } from '../common-enums';
import Web3Mock from '../mocks/Web3Mock';

describe('Contracts class', () => {
  const configuration = new Config({});
  const transactionReceipt = { transactionHash: 'TRANSACTION_HASH' };
  const web3Error = { msg: 'WEB3_ERROR' };
  const signedTransaction = { rawTransaction: 'RAW_TRANSACTION' };
  const REGISTERED_IDENTITY = 'REGISTERED_IDENTITY';
  const UNREGISTERED_IDENTITY = 'UNREGISTERED_IDENTITY';
  const WALLET_PUBLIC_KEY = 'WALLET_PUBLIC_KEY';
  const WALLET_PRIVATE_KEY = 'WALLET_PRIVET_KEY';
  const IDENTITY_PRIVATE_KEY = 'IDENTITY_PRIVET_KEY';
  const WALLET_ADDRESS = 'WALLET_ADDRESS';
  const VEHICLE_ID = 'VEHICLE_ID';
  const MISSION_ID = 'MISSION_ID';
  const MISSION_PRICE = '1000000';

  const forContextSwitch = () => {
    return new Promise((resolve, reject) => {
      jest.useRealTimers();
      setTimeout(resolve, 0);
      jest.useFakeTimers();
    });
  };

  describe('isIdentityRegistered method', () => {
    const isRegisteredCall = jest.fn(() => true);
    const isRegistered = jest.fn(() => ({
      call: isRegisteredCall,
    }));

    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeAll(() => {
      jest.doMock('web3', () => Web3Mock);
      const web3 = require('web3');
      web3.eth.Contract.methods = { isRegistered };
    });

    it('should call relevant functions and return true for registered Id', async () => {
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.isIdentityRegistered(REGISTERED_IDENTITY, configuration),
      ).resolves.toBe(true);
      expect(isRegistered).toHaveBeenCalled();
    });

    it('should call relevant functions and return false for unregistered Id', async () => {
      isRegisteredCall.mockImplementation(() => false);
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.isIdentityRegistered(UNREGISTERED_IDENTITY, configuration),
      ).resolves.toBe(false);
      expect(isRegistered).toHaveBeenCalled();
    });
  });

  describe('registerIdentity method', () => {
    const isRegisteredCall = jest.fn(() => true);
    const isRegistered = jest.fn(() => ({
      call: isRegisteredCall,
    }));
    const register = jest.fn(() => ({
      encodeABI: jest.fn(() => 'encodeABI'),
      estimateGas: jest.fn(() => 100),
      send: jest.fn(() => Promise.resolve()),
    }));
    const privateKeyToAccount = jest.fn(() => ({
      sign: () => ({ v: 'v', r: 'r', s: 's' }),
    }));
    const sendSignedTransactionSuccess = jest.fn((type: string, cb: any) =>
      jest.fn(cb(transactionReceipt)),
    );
    const sendSignedTransaction = jest.fn(() => ({
      once: sendSignedTransactionSuccess,
      on: (type: string, cb: any) => jest.fn(cb(web3Error)),
    }));
    const signTransaction = jest.fn(() => signedTransaction);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeAll(() => {
      jest.doMock('web3', () => Web3Mock);
      const web3 = require('web3');
      web3.eth.Contract.methods = { isRegistered, register };
      web3.eth.accounts = { privateKeyToAccount, signTransaction };
      web3.eth.sendSignedTransaction = sendSignedTransaction;
    });

    it('should call relevant functions and return ALREADY_REGISTERED for registered Id', async () => {
      isRegisteredCall.mockImplementation(() => true);
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.registerIdentity(
          REGISTERED_IDENTITY,
          IDENTITY_PRIVATE_KEY,
          WALLET_ADDRESS,
          WALLET_PRIVATE_KEY,
          configuration,
        ),
      ).resolves.toEqual('ALREADY_REGISTERED');
      expect(isRegistered).toHaveBeenCalled();
    });

    it('should call relevant functions and return transaction receipt for unregistered Id', async () => {
      isRegisteredCall.mockImplementation(() => false);
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.registerIdentity(
          UNREGISTERED_IDENTITY,
          IDENTITY_PRIVATE_KEY,
          WALLET_ADDRESS,
          WALLET_PRIVATE_KEY,
          configuration,
        ),
      ).resolves.toBe(transactionReceipt.transactionHash);
      expect(signTransaction).toHaveBeenCalled();
      expect(privateKeyToAccount).toHaveBeenCalled();
    });

    it('should call relevant functions and throw web3 error', async () => {
      isRegisteredCall.mockImplementation(() => false);
      const web3 = require('web3');
      web3.eth.sendSignedTransaction = jest.fn(() => ({
        once: jest.fn(() => false),
        on: (type: string, cb: any) => jest.fn(cb(web3Error)),
      }));
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.registerIdentity(
          UNREGISTERED_IDENTITY,
          IDENTITY_PRIVATE_KEY,
          WALLET_ADDRESS,
          WALLET_PRIVATE_KEY,
          configuration,
        ),
      ).rejects.toBe(web3Error);
      expect(signTransaction).toHaveBeenCalled();
      expect(privateKeyToAccount).toHaveBeenCalled();
    });
  });

  describe('approveMission method', () => {
    const approve = jest.fn(() => ({
      encodeABI: jest.fn(() => 'encodeABI'),
      estimateGas: jest.fn(() => 100),
    }));
    const sendSignedTransactionSuccess = jest.fn((type: string, cb: any) =>
      jest.fn(cb(transactionReceipt)),
    );
    const sendSignedTransaction = jest.fn(() => ({
      once: sendSignedTransactionSuccess,
      on: (type: string, cb: any) => jest.fn(cb(web3Error)),
    }));
    const signTransaction = jest.fn(() => signedTransaction);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeAll(() => {
      jest.doMock('web3', () => Web3Mock);
      const web3 = require('web3');
      web3.eth.Contract.methods = { approve };
      web3.eth.accounts = { signTransaction };
      web3.eth.sendSignedTransaction = sendSignedTransaction;
    });

    it('should call relevant functions and return transaction receipt', async () => {
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.approveMission(
          REGISTERED_IDENTITY,
          WALLET_PRIVATE_KEY,
          configuration,
        ),
      ).resolves.toBe(transactionReceipt);
      expect(approve).toHaveBeenCalled();
      expect(signTransaction).toHaveBeenCalled();
      expect(sendSignedTransaction).toHaveBeenCalled();
    });

    it('should call relevant functions and throw web3 error', async () => {
      const web3 = require('web3');
      web3.eth.sendSignedTransaction = jest.fn(() => ({
        once: jest.fn(() => false),
        on: (type: string, cb: any) => jest.fn(cb(web3Error)),
      }));
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.approveMission(
          REGISTERED_IDENTITY,
          WALLET_PRIVATE_KEY,
          configuration,
        ),
      ).rejects.toBe(web3Error);
      expect(approve).toHaveBeenCalled();
      expect(signTransaction).toHaveBeenCalled();
      expect(web3.eth.sendSignedTransaction).toHaveBeenCalled();
    });
  });

  describe('startMission method', () => {
    const create = jest.fn(() => ({
      encodeABI: jest.fn(() => 'encodeABI'),
      estimateGas: jest.fn(() => 100),
    }));
    const sendSignedTransactionSuccess = jest.fn((type: string, cb: any) =>
      jest.fn(cb(transactionReceipt)),
    );
    const sendSignedTransaction = jest.fn(() => ({
      once: sendSignedTransactionSuccess,
      on: (type: string, cb: any) => jest.fn(cb(web3Error)),
    }));
    const signTransaction = jest.fn(() => signedTransaction);
    const getTransactionCount = jest.fn(() => 0);
    const toHex = jest.fn(i => i);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeAll(() => {
      jest.doMock('web3', () => Web3Mock);
      const web3 = require('web3');
      web3.eth.Contract.methods = { create };
      web3.eth.accounts = { signTransaction };
      web3.eth.sendSignedTransaction = sendSignedTransaction;
      web3.eth.getTransactionCount = getTransactionCount;
    });

    it('should call relevant functions and return transaction receipt', async () => {
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.startMission(
          MISSION_ID,
          REGISTERED_IDENTITY,
          WALLET_PUBLIC_KEY,
          WALLET_PRIVATE_KEY,
          VEHICLE_ID,
          configuration,
        ),
      ).resolves.toBe(transactionReceipt);
      expect(create).toHaveBeenCalled();
      expect(signTransaction).toHaveBeenCalled();
      expect(sendSignedTransaction).toHaveBeenCalled();
      expect(getTransactionCount).toHaveBeenCalled();
    });

    it('should call relevant functions and throw web3 error', async () => {
      const web3 = require('web3');
      web3.eth.sendSignedTransaction = jest.fn(() => ({
        once: jest.fn(() => false),
        on: (type: string, cb: any) => jest.fn(cb(web3Error)),
      }));
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.startMission(
          MISSION_ID,
          REGISTERED_IDENTITY,
          WALLET_PUBLIC_KEY,
          WALLET_PRIVATE_KEY,
          VEHICLE_ID,
          configuration,
        ),
      ).rejects.toBe(web3Error);
      expect(create).toHaveBeenCalled();
      expect(signTransaction).toHaveBeenCalled();
      expect(web3.eth.sendSignedTransaction).toHaveBeenCalled();
      expect(getTransactionCount).toHaveBeenCalled();
    });
  });

  describe('finalizeMission method', () => {
    const fulfilled = jest.fn(() => ({
      encodeABI: jest.fn(() => 'encodeABI'),
      estimateGas: jest.fn(() => 100),
    }));
    const sendSignedTransactionSuccess = jest.fn((type: string, cb: any) =>
      jest.fn(cb(transactionReceipt)),
    );
    const sendSignedTransaction = jest.fn(() => ({
      once: sendSignedTransactionSuccess,
      on: (type: string, cb: any) => jest.fn(cb(web3Error)),
    }));
    const signTransaction = jest.fn(() => signedTransaction);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeAll(() => {
      jest.doMock('web3', () => Web3Mock);
      const web3 = require('web3');
      web3.eth.Contract.methods = { fulfilled };
      web3.eth.accounts = { signTransaction };
      web3.eth.sendSignedTransaction = sendSignedTransaction;
    });

    it('should call relevant functions and return start mission transaction receipt', async () => {
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.finalizeMission(
          MISSION_ID,
          REGISTERED_IDENTITY,
          WALLET_PRIVATE_KEY,
          configuration,
        ),
      ).resolves.toBe(transactionReceipt);
      expect(fulfilled).toHaveBeenCalled();
      expect(signTransaction).toHaveBeenCalled();
      expect(sendSignedTransaction).toHaveBeenCalled();
    });

    it('should call relevant functions and throw web3 error', async () => {
      const web3 = require('web3');
      web3.eth.sendSignedTransaction = jest.fn(() => ({
        once: jest.fn(() => false),
        on: (type: string, cb: any) => jest.fn(cb(web3Error)),
      }));
      const contracts: any = (await import('../Contracts')).default;
      await expect(
        contracts.finalizeMission(
          MISSION_ID,
          REGISTERED_IDENTITY,
          WALLET_PRIVATE_KEY,
          configuration,
        ),
      ).rejects.toBe(web3Error);
      expect(fulfilled).toHaveBeenCalled();
      expect(signTransaction).toHaveBeenCalled();
      expect(web3.eth.sendSignedTransaction).toHaveBeenCalled();
    });
  });

  describe('watchContract method', () => {
    const getPastEvents = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    beforeAll(() => {
      jest.useFakeTimers();
      jest.doMock('web3', () => Web3Mock);
      const web3 = require('web3');
      web3.eth.Contract.getPastEvents = getPastEvents;
    });

    it('should call relevant functions and receive contract events', async () => {
      const pastEvent1 = [
        {
          transactionHash: 'TRANSACTION_HASH_1',
          blockNumber: 1,
          transactionIndex: 1,
        },
      ];
      const pastEvent2 = [
        {
          transactionHash: 'TRANSACTION_HASH_2',
          blockNumber: 2,
          transactionIndex: 1,
        },
      ];
      const pastEvent3 = [
        {
          transactionHash: 'TRANSACTION_HASH_3',
          blockNumber: 2,
          transactionIndex: 2,
        },
      ];
      getPastEvents
        .mockImplementationOnce(() => Promise.resolve(pastEvent1))
        .mockImplementationOnce(() => Promise.resolve(pastEvent2))
        .mockImplementationOnce(() => Promise.resolve(pastEvent3))
        .mockImplementation(() => Promise.resolve({}));
      const spy = jest.fn();
      const contracts: any = (await import('../Contracts')).default;
      const observable = contracts.watchContract(
        REGISTERED_IDENTITY,
        ContractTypes.basicMission,
        configuration,
      );
      observable.subscribe(spy);
      jest.advanceTimersByTime(10000);
      await forContextSwitch();
      expect(getPastEvents.mock.calls.length).toBe(5);
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual(pastEvent1[0]);
      expect(spy.mock.calls[1][0]).toEqual(pastEvent2[0]);
    });

    it('should call relevant functions and receive contract error events', async () => {
      getPastEvents.mockImplementation(() => Promise.reject(web3Error));
      const spy = jest.fn();
      const contracts: any = (await import('../Contracts')).default;
      const observable = contracts.watchContract(
        REGISTERED_IDENTITY,
        ContractTypes.basicMission,
        configuration,
      );
      observable.subscribe(spy, (err: any) => {
        expect(err).toEqual(web3Error);
      });
      jest.advanceTimersByTime(10000);
      await forContextSwitch();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
