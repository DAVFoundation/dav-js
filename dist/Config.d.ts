import IConfig from './IConfig';
import { BlockchainType } from './common-enums';
/**
 * @class The DavSDK Config Class is used to create configuration object to the SDK.
 */
export default class Config implements IConfig {
    /**
     * @param props  Partial configuration object
     * @returns      DavSDK configuration object.
     */
    constructor(props: Partial<IConfig>);
}
export declare const defaultConfiguration: {
    ethNodeUrl: string;
    apiSeedUrls: string[];
    kafkaSeedUrls: string[];
    identityTtl: number;
    needTypeTtl: number;
    needTtl: number;
    missionConsumerTtl: number;
    missionProviderTtl: number;
    kafkaBrowserPollingInterval: number;
    kafkaBrowserRequestTimeout: number;
    blockchainType: BlockchainType;
};
//# sourceMappingURL=Config.d.ts.map