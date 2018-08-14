import { ID, DavID } from './common-types';
import IConfig from './IConfig';
import Identity from './Identity';
import Contracts from './Contracts';
/**
 * @class The DavSDK class instance.
 */
export default class SDK {
  constructor(private config: IConfig) { /**/ }
  /**
   * @method getIdentity Used to create an instance DAV Identity class.
   * @param davId the unique DAV identity string.
   * @param config DAV configuration object.
   * @returns Identity class instance with the specified configuration object and DavId.
   */
  public async getIdentity(davId: DavID, config?: IConfig): Promise<Identity> {
    const isIdentityRegistered = await this.isRegistered(davId);
    if (!isIdentityRegistered) {
      throw new Error(`${davId} is not a registered identity`);
    }
    // TODO: create topic for Identity Channel#1
    return new Identity('NO_TOPIC', davId, config || this.config);
  }
  /**
   * @method isRegistered Used to check the DAV Identity is registered.
   * @param davId the unique DAV identity string.
   * @returns true if the davId that specified is registered to the DAV identity contract, and false otherwise.
   */
  public async isRegistered(davId: DavID): Promise<boolean> {
    return await Contracts.isIdentityRegistered(davId, this.config);
  }
  /**
   * @method registerIdentity Used to register an instance to the DAV identity contract.
   * @param davId the DAV identity string to register.
   * @param walletAddress Ethereum wallet address to register the identity with.
   * @param walletPrivateKey Ethereum wallet private key, to charge for the transaction.
   * @param identityPrivateKey Ethereum private key to sign the registration.
   * @returns Ethereum transaction receipt object.
   */
  public async registerIdentity(davId: DavID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string): Promise<string> {
    return await Contracts.registerIdentity(davId, identityPrivateKey, walletAddress, walletPrivateKey, this.config);
  }
}
