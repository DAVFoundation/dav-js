"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Identity_1 = require("./Identity");
const Contracts_1 = require("./Contracts");
/**
 * @class The DavSDK class instance.
 */
class SDK {
    constructor(_config) {
        this._config = _config;
        /**/
    }
    /**
     * @method getIdentity Used to create an instance DAV Identity class.
     * @param davId the unique DAV identity string.
     * @param config DavSDK configuration object.
     * @returns Identity class instance with the specified configuration object and DavId.
     */
    async getIdentity(davId, config) {
        const isIdentityRegistered = await this.isRegistered(davId);
        if (!isIdentityRegistered) {
            throw new Error(`${davId} is not a registered identity`);
        }
        // TODO: create topic for Identity Channel#1
        return new Identity_1.default('NO_TOPIC', davId, config || this._config);
    }
    /**
     * @method isRegistered Used to check the DAV Identity is registered.
     * @param davId The unique DAV identity string.
     * @returns true if the davId that specified is registered to the DAV identity contract, and false otherwise.
     */
    async isRegistered(davId) {
        return await Contracts_1.default.isIdentityRegistered(davId, this._config);
    }
    /**
     * @method registerIdentity Used to register an instance to the DAV identity contract.
     * @param davId The DAV identity string to register.
     * @param walletAddress Ethereum wallet address to register the identity with.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the transaction.
     * @param identityPrivateKey Ethereum private key to sign the registration.
     * @returns Ethereum transaction receipt object.
     */
    async registerIdentity(davId, walletAddress, walletPrivateKey, identityPrivateKey) {
        return await Contracts_1.default.registerIdentity(davId, identityPrivateKey, walletAddress, walletPrivateKey, this._config);
    }
}
exports.default = SDK;

//# sourceMappingURL=SDK.js.map
