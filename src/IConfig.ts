import { BlockchainType } from './common-enums';

export default interface IConfig {
    ethNodeUrl?: string;
    apiSeedUrls?: string[];
    kafkaSeedUrls?: string[];
    identityTtl?: number;
    needTypeTtl?: number;
    needTtl?: number;
    missionConsumerTtl?: number;
    missionProviderTtl?: number;
    blockchainType?: BlockchainType;
}
