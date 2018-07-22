import { ID, DavID } from './common-types';
import IConfig from './IConfig';
import Identity from './Identity';

export default class SDK {
  constructor(private config: IConfig) { /**/ }

  // Not sure this need a config param
  public async getIdentity(davId: DavID, config?: IConfig): Promise<Identity> { return new Identity('', '', this.config); }
  public async isRegistered(davID: DavID): Promise<boolean> { return false; }
  public async registerIdentity(davId: DavID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string) { /**/ }
}
