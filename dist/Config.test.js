"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const common_enums_1 = require("./common-enums");
const Config_2 = require("./Config");
describe('Config class', () => {
    describe('check default configuration are set', () => {
        it('should contain all default configuration', async () => {
            const configuration = new Config_1.default({});
            expect(configuration).toEqual(Config_2.defaultConfiguration);
        });
    });
    describe('check custom configurations are set', () => {
        it('should contain all custom configuration', async () => {
            const configurationObject = {
                ethNodeUrl: 'ETH_NODE_URL',
                apiSeedUrls: ['API_SEED_URL_1', 'API_SEED_URL_2'],
                kafkaSeedUrls: ['KAFKA_SEED_URL_1', 'KAFKA_SEED_URL_2'],
                identityTtl: 12,
                needTypeTtl: 34,
                needTtl: 56,
                missionConsumerTtl: 78,
                missionProviderTtl: 90,
                kafkaBrowserPollingInterval: 1000,
                kafkaBrowserRequestTimeout: 500,
                blockchainType: common_enums_1.BlockchainType.local,
                contractPath: 'CONTRACT_PATH',
            };
            const configuration = new Config_1.default(configurationObject);
            expect(configuration).toEqual(configurationObject);
        });
    });
});

//# sourceMappingURL=Config.test.js.map
