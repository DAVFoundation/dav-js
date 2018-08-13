import { BlockchainType } from './common-enums';
import { ConstructsArtifacts } from './common-types';
export default interface IConfig {

   /**
    * Ethereum blockchain node url.
    */
    ethNodeUrl?: string;
   /**
    * Array of Dav API nodes url.
    */
    apiSeedUrls?: string[];
   /**
    * Array of Dav kafka nodes url.
    */
    kafkaSeedUrls?: string[];
   /**
    * Hop limit (in ms) for Identity messages to expires (not in use).
    */
    identityTtl?: number;
   /**
    * Hop limit (in ms) needs subscription to expires.
    */
    needTypeTtl?: number;
   /**
    * Hop limit (in ms) for need registration to expires.
    */
    needTtl?: number;
   /**
    * Hop limit (in ms) for missions to expires.
    */
    missionConsumerTtl?: number;
   /**
    * Hop limit (in ms) for missionProvider to expires (not in use).
    */
    missionProviderTtl?: number;
   /**
    * Time, in milliseconds, the timer should delay in between reask kafka for new events.
    */
    kafkaPollingInterval?: number;
   /**
    * Blockchain type (local/test/main). for using local blockchain, you must specify contracts.
    */
    blockchainType?: BlockchainType;
   /**
    * Constructs artifacts.
    */
    contracts?: ConstructsArtifacts;
}
