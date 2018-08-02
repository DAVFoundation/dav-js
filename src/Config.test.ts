import Config from './Config';
import { BlockchainType } from './common-enums';

describe('Config class', () => {

  beforeAll(() => { /**/ });

  describe('check default configuration are set', () => {
    beforeAll(() => { /**/ });

    xit('should contain all default configuration', async () => {
      const configuration = new Config({});
      expect(configuration).toEqual({
        ethNodeUrl: 'https://ropsten.infura.io/wUiZtmeZ1KwjFrcC8zRO',
        apiSeedUrls: [''],
        kafkaSeedUrls: [''],
        identityTtl: 10000,
        needTypeTtl: 10000,
        needTtl: 10000,
        missionConsumerTtl: 10000,
        missionProviderTtl: 10000,
        blockchainType: BlockchainType.ropsten,
        contractPath: './contracts/',
    });
    });
  });

  describe('check costume configuration are set', () => {
    beforeAll(() => { /**/ });

    xit('should contain all costume configuration', async () => {
      const configurationObject = {
        ethNodeUrl: 'ETH_NODE_URL',
        apiSeedUrls: ['API_SEED_URL_1', 'API_SEED_URL_2'],
        kafkaSeedUrls: ['KAFKA_SEED_URL_1', 'KAFKA_SEED_URL_2'],
        identityTtl: 12,
        needTypeTtl: 34,
        needTtl: 56,
        missionConsumerTtl: 78,
        missionProviderTtl: 90,
        blockchainType: BlockchainType.local,
        contractPath: 'CONTRACT_PATH',
    };
      const configuration = new Config(configurationObject);
      expect(configuration).toEqual(configurationObject);
    });
  });

});
