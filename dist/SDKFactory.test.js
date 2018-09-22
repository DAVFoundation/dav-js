"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SDKFactory_1 = require("./SDKFactory");
const Config_1 = require("./Config");
describe('SDKFactory method', () => {
    it('should create SDK instance', () => {
        // Arrange
        const config = new Config_1.default({
            apiSeedUrls: ['apiUrl'],
            ethNodeUrl: 'ethUrl',
            kafkaSeedUrls: ['kafkaUrl'],
        });
        // Act
        const sdk = SDKFactory_1.default(config);
        // Assert
        expect(sdk.getIdentity).toBeDefined();
        expect(sdk.isRegistered).toBeDefined();
        expect(sdk.registerIdentity).toBeDefined();
    });
});

//# sourceMappingURL=SDKFactory.test.js.map
