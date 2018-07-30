import { log } from 'handlebars';
import Config from './Config';
import { contracts as contractsType } from './common-enums';
import Mission from './Mission';

describe('Contracts class', () => {

  const configuration = new Config({});
  const transactionReceipt = {transactionHash: 'TRANSACTION_HASH'};
  const pastEvent = {transactionHash: 'TRANSACTION_HASH'};
  const web3Error = {msg: 'WEB3_ERROR'};
  const REGISTERED_IDENTITY = 'REGISTERED_IDENTITY';
  const UNREGISTERED_IDENTITY = 'UNREGISTERED_IDENTITY';
  const WALLET_PRIVATE_KEY = 'WALLET_PRIVET_KEY';
  const IDENTITY_PRIVATE_KEY = 'IDENTITY_PRIVET_KEY';
  const WALLET_ADDRESS = 'WALLET_ADDRESS';
  const VEHICLE_ID = 'VEHICLE_ID';
  const MISSION_ID = 'MISSION_ID';

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
      expect(contracts.isIdentityRegistered(REGISTERED_IDENTITY, configuration)).resolves.toEqual(true);
    });

    it('should return false for unregistered Id', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.isIdentityRegistered(UNREGISTERED_IDENTITY, configuration)).resolves.toEqual(false);

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
      expect(contracts.registerIdentity(REGISTERED_IDENTITY,
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
      expect(contracts.registerIdentity(UNREGISTERED_IDENTITY,
                                        IDENTITY_PRIVATE_KEY,
                                        WALLET_ADDRESS,
                                        WALLET_PRIVATE_KEY,
                                        configuration)).resolves.toEqual(transactionReceipt);
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
      expect(contracts.registerIdentity(UNREGISTERED_IDENTITY,
                                        IDENTITY_PRIVATE_KEY,
                                        WALLET_ADDRESS,
                                        WALLET_PRIVATE_KEY,
                                        configuration)).rejects.toEqual(web3Error);
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
      expect(contracts.approveMission(REGISTERED_IDENTITY,
                                      WALLET_PRIVATE_KEY,
                                      configuration)).resolves.toEqual(transactionReceipt);
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
      expect(contracts.approveMission(REGISTERED_IDENTITY,
                                      WALLET_PRIVATE_KEY,
                                      configuration)).rejects.toEqual(web3Error);
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
      expect(contracts.startMission(MISSION_ID,
                                    REGISTERED_IDENTITY,
                                    WALLET_PRIVATE_KEY,
                                    VEHICLE_ID,
                                    configuration)).resolves.toEqual(transactionReceipt);
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
      expect(contracts.startMission(MISSION_ID,
                                    REGISTERED_IDENTITY,
                                    WALLET_PRIVATE_KEY,
                                    VEHICLE_ID,
                                    configuration)).rejects.toEqual(web3Error);
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
      expect(contracts.finalizeMission(MISSION_ID,
                                       REGISTERED_IDENTITY,
                                       WALLET_PRIVATE_KEY,
                                       configuration)).resolves.toEqual(transactionReceipt);
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
      expect(contracts.finalizeMission(MISSION_ID,
                                       REGISTERED_IDENTITY,
                                       WALLET_PRIVATE_KEY,
                                       configuration)).rejects.toEqual(web3Error);
    });
  });

  describe('watchContract method', () => {

    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should receive contract event', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          pastEvent,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      const contractEvents = contracts.watchContract(REGISTERED_IDENTITY,
        contractsType.basicMission,
        configuration);
      contractEvents.subscribe((event: any) => {
        expect(event).resolves.toEqual(pastEvent);
      });
    });

  });

});
