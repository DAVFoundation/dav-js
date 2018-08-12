import { BlockchainType, ContractTypes } from './common-enums';

export default interface IConfig {
    ethNodeUrl?: string;
    apiSeedUrls?: string[];
    kafkaSeedUrls?: string[];
    identityTtl?: number;
    needTypeTtl?: number;
    needTtl?: number;
    missionConsumerTtl?: number;
    missionProviderTtl?: number;
    kafkaPollingInterval?: number;
    blockchainType?: BlockchainType;
    contracts?: { [T in ContractTypes]: any };
}
