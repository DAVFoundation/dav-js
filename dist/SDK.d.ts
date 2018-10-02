import { DavID } from './common-types';
import IConfig from './IConfig';
import Identity from './Identity';
/**
 * @class The DavSDK class instance.
 */
export default class SDK {
    private _config;
    constructor(_config: IConfig);
    /**
     * @method getIdentity Used to create an instance DAV Identity class.
     * @param davId the unique DAV identity string.
     * @param config DavSDK configuration object.
     * @returns Identity class instance with the specified configuration object and DavId.
     */
    getIdentity(davId: DavID, config?: IConfig): Promise<Identity>;
    /**
     * @method isRegistered Used to check the DAV Identity is registered.
     * @param davId The unique DAV identity string.
     * @returns true if the davId that specified is registered to the DAV identity contract, and false otherwise.
     */
    isRegistered(davId: DavID): Promise<boolean>;
    /**
     * @method registerIdentity Used to register an instance to the DAV identity contract.
     * @param davId The DAV identity string to register.
     * @param walletAddress Ethereum wallet address to register the identity with.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the transaction.
     * @param identityPrivateKey Ethereum private key to sign the registration.
     * @returns Ethereum transaction receipt object.
     */
    registerIdentity(davId: DavID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string): Promise<string>;
}
//# sourceMappingURL=SDK.d.ts.map