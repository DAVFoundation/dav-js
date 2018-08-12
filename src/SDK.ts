import { ID, DavID } from './common-types';
import IConfig from './IConfig';
import Identity from './Identity';
import Contracts from './Contracts';

export default class SDK {
  constructor(private config: IConfig) { /**/ }

  public async getIdentity(davId: DavID, config?: IConfig): Promise<Identity> {
    const isIdentityRegistered = await this.isRegistered(davId);
    if (!isIdentityRegistered) {
      throw new Error(`${davId} is not a registered identity`);
    }
    // TODO: create topic for Identity Channel#1
    return new Identity('NO_TOPIC', davId, config || this.config);
  }

  public async isRegistered(davId: DavID): Promise<boolean> {
    return await Contracts.isIdentityRegistered(davId, this.config);
  }

  public async registerIdentity(davId: DavID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string): Promise<string> {
    return await Contracts.registerIdentity(davId, identityPrivateKey, walletAddress, walletPrivateKey, this.config);
  }
}
