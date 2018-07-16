import { ID } from './common';
import IConfig from './IConfig';
import Identity from './Identity';

export default class SDK {
  constructor(config: IConfig) { /**/ }

  // Not sure this need a config param
  public getIdentity(davId: ID, privateKey: string, config?: IConfig): Identity { return new Identity('', ''); }
  public async isRegistered(davID: ID): Promise<boolean> { return false; }
  public async registerIdentity(davId: ID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string) { /**/ }
}
