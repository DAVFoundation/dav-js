import { BlockchainType } from './common-enums';
import { ConstructsArtifacts } from './common-types';
export default interface IConfig {

    /**
     * @property Ethereum blockchain node url.
     */
    ethNodeUrl?: string;
    /**
     * @property Array of Dav API nodes url.
     */
    apiSeedUrls?: string[];
    /**
     * @property Array of Dav kafka nodes url.
     */
    kafkaSeedUrls?: string[];
    /**
     * @property Hop limit, in seconds, for Identity messages to expires (not in use).
     */
    identityTtl?: number;
    /**
     * @property Hop limit, in seconds, needs subscription to expires.
     */
    needTypeTtl?: number;
    /**
     * @property Hop limit, in seconds, for need registration to expires.
     */
    needTtl?: number;
    /**
     * @property Hop limit, in seconds, for missions to expires.
     */
    missionConsumerTtl?: number;
    /**
     * @property Hop limit, in seconds, for missionProvider to expires (not in use).
     */
    missionProviderTtl?: number;
    /**
     * @property Time, in milliseconds, the timer should delay in between reask kafka for new events.
     */
    kafkaPollingInterval?: number;
    /**
     * @property Blockchain type (local/test/main). for using local blockchain, you must specify contracts.
     */
    blockchainType?: BlockchainType;
    /**
     * @property Constructs artifacts.
     */
    contracts?: ConstructsArtifacts;
}
