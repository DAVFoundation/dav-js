import IConfig from './IConfig';
import { BlockchainType } from './common-enums';

const defaultValues = {
    ethNodeUrl: 'https://ropsten.infura.io/wUiZtmeZ1KwjFrcC8zRO',
    apiSeedUrls: [''],
    kafkaSeedUrls: [''],
    identityTtl: 10000,
    needTypeTtl: 10000,
    needTtl: 10000,
    missionConsumerTtl: 10000,
    missionProviderTtl: 10000,
    kafkaBrowserPollingInterval: 1000,
    kafkaBrowserRequestTimeout: 500,
    blockchainType: BlockchainType.test,
};
/**
 * @class The DavSDK Config Class is used to create configuration object to the SDK.
 */
export default class Config implements IConfig {
/**
 * @param props  Partial configuration object
 * @returns      DavSDK configuration object.
 */
    constructor(props: Partial<IConfig>) {
        Object.assign(this, defaultValues, props);
    }
}

export const defaultConfiguration = defaultValues;
