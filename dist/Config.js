"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_enums_1 = require("./common-enums");
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
    blockchainType: common_enums_1.BlockchainType.test,
};
/**
 * @class The DavSDK Config Class is used to create configuration object to the SDK.
 */
class Config {
    /**
     * @param props  Partial configuration object
     * @returns      DavSDK configuration object.
     */
    constructor(props) {
        Object.assign(this, defaultValues, props);
    }
}
exports.default = Config;
exports.defaultConfiguration = defaultValues;

//# sourceMappingURL=Config.js.map
