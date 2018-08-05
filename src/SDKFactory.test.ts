import SDKFactory from './SDKFactory';
import Configuration from './Config';

describe('SDKFactory method', () => {
    it('should create SDK instance', () => {
        // Arrange
        const config = new Configuration({apiSeedUrls: ['apiUrl'], ethNodeUrl: 'ethUrl', kafkaSeedUrls: ['kafkaUrl']});

        // Act
        const sdk = SDKFactory(config);

        // Assert
        expect(sdk.getIdentity).toBeDefined();
        expect(sdk.isRegistered).toBeDefined();
        expect(sdk.registerIdentity).toBeDefined();
    });
});
