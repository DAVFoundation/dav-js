import Config from './Config';
import Identity from './Identity';
import IConfig from './IConfig';

describe('SDK class', () => {
  const config = new Config({}) as IConfig;
  const davId = 'DAV_ID';
  const contractsError = { msg: 'WEB3_ERROR' };
  const contractsMock = {
    isIdentityRegistered: jest.fn(),
    registerIdentity: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.doMock('./Contracts', () => ({ default: contractsMock }));
  });

  describe('getIdentity method', () => {
    it('should succeed, validates identity', async () => {
      contractsMock.isIdentityRegistered.mockImplementation(() =>
        Promise.resolve(true),
      );
      // tslint:disable-next-line:no-shadowed-variable
      const SDK: any = (await import('./SDK')).default;
      const sdk = new SDK(config);
      const identity = new Identity('NO_TOPIC', davId, config);
      await expect(sdk.getIdentity(davId, config)).resolves.toEqual(identity);
    });

    it('should throw due to unregistered dav id', async () => {
      contractsMock.isIdentityRegistered.mockImplementation(() =>
        Promise.resolve(false),
      );
      // tslint:disable-next-line:no-shadowed-variable
      const SDK: any = (await import('./SDK')).default;
      const sdk = new SDK(config);
      await expect(sdk.getIdentity(davId, config)).rejects.toThrow(
        `${davId} is not a registered identity`,
      );
    });

    it('should throw due to blockchain exception', async () => {
      contractsMock.isIdentityRegistered.mockImplementation(() =>
        Promise.reject(contractsError),
      );
      // tslint:disable-next-line:no-shadowed-variable
      const SDK: any = (await import('./SDK')).default;
      const sdk = new SDK(config);
      await expect(sdk.getIdentity(davId, config)).rejects.toEqual(
        contractsError,
      );
    });
  });

  describe('isRegistered method', () => {
    it('validates registered dav id', async () => {
      contractsMock.isIdentityRegistered.mockImplementation(() =>
        Promise.resolve(true),
      );
      // tslint:disable-next-line:no-shadowed-variable
      const SDK: any = (await import('./SDK')).default;
      const sdk = new SDK(config);
      const isRegistered = await sdk.isRegistered('registered dav id');
      expect(isRegistered).toBe(true);
    });

    it('validates unregistered dav id', async () => {
      contractsMock.isIdentityRegistered.mockImplementation(() =>
        Promise.resolve(false),
      );
      //y tslint:disable-next-line:no-shadowed-variable
      const SDK: any = (await import('./SDK')).default;
      const sdk = new SDK(config);
      const isRegistered = await sdk.isRegistered('unregistered dav id');
      expect(isRegistered).toBe(false);
    });

    it('should throw due to blockchain exception', async () => {
      contractsMock.isIdentityRegistered.mockImplementation(() =>
        Promise.reject(contractsError),
      );
      // tslint:disable-next-line:no-shadowed-variable
      const SDK: any = (await import('./SDK')).default;
      const sdk = new SDK(config);
      await expect(sdk.isRegistered(davId)).rejects.toEqual(contractsError);
    });
  });

  describe('registerIdentity method', () => {
    it('should succeed, validate web3 mock has been called', async () => {
      contractsMock.registerIdentity.mockImplementation(() =>
        Promise.resolve('TRANSACTION_HASH'),
      );
      // tslint:disable-next-line:no-shadowed-variable
      const SDK: any = (await import('./SDK')).default;
      const sdk = new SDK(config);
      await expect(
        sdk.registerIdentity(
          'davId',
          'walletAddress',
          'walletPrivateKey',
          'identityPrivateKey',
        ),
      ).resolves.toEqual('TRANSACTION_HASH');
    });

    it('should throw due to blockchain exception', async () => {
      contractsMock.registerIdentity.mockImplementation(() =>
        Promise.reject(contractsError),
      );
      // tslint:disable-next-line:no-shadowed-variable
      const SDK: any = (await import('./SDK')).default;
      const sdk = new SDK(config);
      await expect(
        sdk.registerIdentity(
          'davId',
          'walletAddress',
          'walletPrivateKey',
          'identityPrivateKey',
        ),
      ).rejects.toEqual(contractsError);
    });
  });
});
