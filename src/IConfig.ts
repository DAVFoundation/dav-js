import { BlockchainType } from './common-enums';
import { ConstructsArtifacts } from './common-types';
export default interface IConfig {

   /**
    * Description: Ethereum blockchain node url.
    *
    * Default: https://ropsten.infura.io/wUiZtmeZ1KwjFrcC8zRO
    */
    ethNodeUrl?: string;
   /**
    * Description: Array of Dav API node urls.
    *
    * Default: ['']
    */
    apiSeedUrls?: string[];
   /**
    * Description: Array of Dav kafka node urls.
    *
    * Default: ['']
    */
    kafkaSeedUrls?: string[];
   /**
    * Description: Hop limit (in ms) for Identity messages to expires (not in use).
    *
    * Default: 10000
    */
    identityTtl?: number;
   /**
    * Description: Hop limit (in ms) needs subscription to expires.
    *
    * Default: 10000
    */
    needTypeTtl?: number;
   /**
    * Description: Hop limit (in ms) for need registration to expires.
    *
    * Default: 10000
    */
    needTtl?: number;
   /**
    * Description: Hop limit (in ms) for missions to expires.
    *
    * Default: 10000
    */
    missionConsumerTtl?: number;
   /**
    * Description: Hop limit (in ms) for missionProvider to expires (not in use).
    *
    * Default: 10000
    */
    missionProviderTtl?: number;
   /**
    * Description: Space of time (in ms) between reask kafka for new events.
    *
    * Default: 1000
    */
    kafkaPollingInterval?: number;
   /**
    * Description: Blockchain type (local/test/main). for using local blockchain, you must specify contracts.
    *
    * Default: BlockchainType.local
    */
    blockchainType?: BlockchainType;
   /**
    * Description: Constructs artifacts.
    *
    * Default: null
    */
    contracts?: ConstructsArtifacts;
}
