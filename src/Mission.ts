
import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import Identity from './Identity';
import Message from './Message';
import ISendMessageParams from './ISendMessageParams';

export default class Mission {
    public needer: Identity;

    constructor(public selfId: ID, public peerId: ID, private config: IConfig) {
        /**/
    }

    public async sendMessage(type: string, payload: any, params: ISendMessageParams) { /**/ }
    public messages(): Observable<Message> { return new Observable<Message>(); }
    public async finalizeMission(walletPrivateKey: string) { /**/ }
}
