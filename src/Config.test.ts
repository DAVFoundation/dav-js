import Config from './Config';
import { BlockchainType } from './common-enums';
import { defaultConfiguration } from './Config';

describe('Config class', () => {


  describe('check default configuration are set', () => {

    it('should contain all default configuration', async () => {
      const configuration = new Config({});
      expect(configuration).toEqual(defaultConfiguration);
    });
  });

  describe('check costume configuration are set', () => {

    it('should contain all costume configuration', async () => {
      const configurationObject = {
        ethNodeUrl: 'ETH_NODE_URL',
        apiSeedUrls: ['API_SEED_URL_1', 'API_SEED_URL_2'],
        kafkaSeedUrls: ['KAFKA_SEED_URL_1', 'KAFKA_SEED_URL_2'],
        identityTtl: 12,
        needTypeTtl: 34,
        needTtl: 56,
        missionConsumerTtl: 78,
        missionProviderTtl: 90,
        kafkaPollingInterval: 1000,
        blockchainType: BlockchainType.local,
        contractPath: 'CONTRACT_PATH',
      };
      const configuration = new Config(configurationObject);
      expect(configuration).toEqual(configurationObject);
    });
  });

});
