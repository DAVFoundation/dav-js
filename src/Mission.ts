
import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import Identity from './Identity';
import Message from './Message';
import ISendMessageParams from './ISendMessageParams';
import BidParams from './BidParams';

export default class Mission {

    constructor(public selfId: ID, public peerId: ID, public needer: Identity, private config: IConfig) {
        /**/
    }

    public async sendMessage(type: string, payload: any, params: ISendMessageParams) { /**/ }
    public messages<T extends BidParams>(): Observable<Message<T>> { return null; }
    public async finalizeMission(walletPrivateKey: string) { /**/ }
}
