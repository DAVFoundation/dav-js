import { log } from 'handlebars';
import Config from './Config';

describe('Contracts class', () => {

  // TODO: unless there is a very good reason - don't use common variables inb tests
  const configuration = new Config({});
  const transactionReceipt = {transactionHash: 'TRANSACTION_HASH'};

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
      expect(contracts.isIdentityRegistered('REGISTERED_IDENTITY', configuration)).resolves.toEqual(true);
    });

    it('should return false for unregistered Id', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.isIdentityRegistered('UNREGISTERED_IDENTITY', configuration)).resolves.toEqual(false);

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
      expect(contracts.registerIdentity( 'REGISTERED_IDENTITY',
                                         'IDENTITY_PRIVATE_KEY',
                                         'WALLET_ADDRESS',
                                         'WALLET_PRIVATE_KEY',
                                         configuration)).resolves.toEqual('ALREADY_REGISTERED');
    });

    it('should return transaction receipt for unregistered Id', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionSuccess: (type: string, cb: any) => cb('confirmationNumber', transactionReceipt),
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.registerIdentity( 'UNREGISTERED_IDENTITY',
                                         'IDENTITY_PRIVATE_KEY',
                                         'WALLET_ADDRESS',
                                         'WALLET_PRIVATE_KEY',
                                         configuration)).resolves.toEqual(transactionReceipt);
    });

    it('should throw some web3 error', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionError: (type: string, cb: any) => cb('WEB3_ERROR'),
          sendSignedTransactionSuccess: (type: string, cb: any) => false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.registerIdentity( 'UNREGISTERED_IDENTITY',
                                         'IDENTITY_PRIVATE_KEY',
                                         'WALLET_ADDRESS',
                                         'WALLET_PRIVATE_KEY',
                                         configuration)).rejects.toEqual('WEB3_ERROR');
    });
  });

  describe('approveMission method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should return approve mission transaction receipt', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionSuccess: (type: string, cb: any) => cb('confirmationNumber', transactionReceipt),
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.approveMission( 'REGISTERED_IDENTITY',
                                     'WALLET_PRIVATE_KEY',
                                     configuration)).resolves.toEqual(transactionReceipt);
    });

    it('should throw some web3 error', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionError: (type: string, cb: any) => cb('WEB3_ERROR'),
          sendSignedTransactionSuccess: (type: string, cb: any) => false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.registerIdentity( 'REGISTERED_IDENTITY',
                                         'WALLET_PRIVATE_KEY',
                                         configuration)).rejects.toEqual('WEB3_ERROR');
    });
  });

  describe('startMission method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should return start mission transaction receipt', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionSuccess: (type: string, cb: any) => cb('confirmationNumber', transactionReceipt),
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.startMission( 'MISSION_ID',
                                    'REGISTERED_IDENTITY',
                                    'WALLET_PRIVATE_KEY',
                                    'VEHICLE_ID',
                                    configuration)).resolves.toEqual(transactionReceipt);
    });

    it('should throw some web3 error', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionError: (type: string, cb: any) => cb('WEB3_ERROR'),
          sendSignedTransactionSuccess: (type: string, cb: any) => false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.startMission( 'MISSION_ID',
                                    'REGISTERED_IDENTITY',
                                    'WALLET_PRIVATE_KEY',
                                    'VEHICLE_ID',
                                    configuration)).rejects.toEqual('WEB3_ERROR');
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
          sendSignedTransactionSuccess: (type: string, cb: any) => cb('confirmationNumber', transactionReceipt),
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.finalizeMission( 'MISSION_ID',
                                        'REGISTERED_IDENTITY',
                                        'WALLET_PRIVATE_KEY',
                                        configuration)).resolves.toEqual(transactionReceipt);
    });

    it('should throw some web3 error', async () => {
      const web3Factory = require('./mocks/web3');
      jest.doMock('web3', () => {
        return web3Factory({
          isRegistered: false,
          sendSignedTransactionError: (type: string, cb: any) => cb('WEB3_ERROR'),
          sendSignedTransactionSuccess: (type: string, cb: any) => false,
        });
      });
      const contracts: any = (await import('./Contracts')).default;
      expect(contracts.finalizeMission( 'MISSION_ID',
                                        'REGISTERED_IDENTITY',
                                        'WALLET_PRIVATE_KEY',
                                        configuration)).rejects.toEqual('WEB3_ERROR');
    });
  });

});
