import IConfig from './IConfig';
import { DavID, Observable } from './common-types';

export default class Contracts {

    public static async isIdentityRegistered(davID: DavID, config: IConfig): Promise<boolean> {
         return false;
    }

    public static async registerIdentity(davId: DavID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string, config: IConfig):
     Promise<void> {
         /**/
    }

    public static async finalizeMission(walletPrivateKey: string, config: IConfig): Promise<void>  {
         /**/
    }

    public static async signContract(walletPrivateKey: string, config: IConfig): Promise<void>  {
         /**/
    }

    public static watchContract(contratHash: string, config: IConfig)/*: Observable<>*/ {
         /**/
    }
}
