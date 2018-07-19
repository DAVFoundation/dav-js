import Config from './Config';
import SDK from './SDK';

describe('SDK class', () => {
    const config = new Config({});

    beforeAll(() => { /**/ });

    describe('isRegistered method', () => {
      beforeAll(() => { /**/ });

      it('validates registered dav id', async () => {
        const sdk = new SDK(config);
        const isRegistered = await sdk.isRegistered('registered dav id');
        expect(isRegistered).toBe(true);
      });

      it('validates unregistered dav id', async () => {
        const sdk = new SDK(config);
        const isRegistered = await sdk.isRegistered('unregistered dav id');
        expect(isRegistered).toBe(false);
      });

      it('should throw due to blockchain exception', async () => {
        const sdk = new SDK(config);
        expect(await sdk.isRegistered('dav id')).toThrow('blockchain excpetion');
      });
    });

    describe('registerIdentity method', () => {
        beforeAll(() => { /**/ });

        it('should success, validate web3 mock has been called', async () => {
          const sdk = new SDK(config);
          await sdk.registerIdentity('davId', 'walletAddress', 'walletPrivateKey', 'identityPrivateKey');
          // check web3 mock to be called with valid params
        });

        it('should throw due to blockchain exception', async () => {
          const sdk = new SDK(config);
          expect(await sdk.registerIdentity('davId', 'walletAddress', 'walletPrivateKey', 'identityPrivateKey')).toThrow('blockchain excpetion');
        });

        it('should throw due to wallet key and wallet address which do not match', async () => {
            const sdk = new SDK(config);
            expect(await sdk.registerIdentity('davId', 'walletAddress', 'walletPrivateKey', 'identityPrivateKey'))
            .toThrow('wrong wallet details excpetion');
        });

        it('should throw due to identity key and dav id which do not match', async () => {
            const sdk = new SDK(config);
            expect(await sdk.registerIdentity('davId', 'walletAddress', 'walletPrivateKey', 'identityPrivateKey'))
            .toThrow('wrong dav details excpetion');
        });
    });

    describe('getIdentity method', () => {
        beforeAll(() => { /**/ });

        it('should success, validates identity', async () => {
          const sdk = new SDK(config);
          const identity = await sdk.getIdentity('davId', 'privateKey', config);
          // validate each identity's properties in a separate test
        });

        it('should throw due to unregistered dav id', async () => {
            const sdk = new SDK(config);
            expect(await sdk.getIdentity('davId', 'privateKey', config)).toThrow('unregisterd dav id exception');
        });

        it('should throw due to blockchain exception', async () => {
            const sdk = new SDK(config);
            expect(await sdk.getIdentity('davId', 'privateKey', config)).toThrow('blockchain exception');
        });
    });
});
