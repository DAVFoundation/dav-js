
import { ID, Rx } from './common';
import IConfig from './IConfig';
import Identity from './Identity';
import Message from './Message';
import ISendMessageParams from './ISendMessageParams';

export default class Mission {
    public id: ID;
    public needer: Identity;

    constructor(missionId: ID, private config: IConfig) {
        /**/
    }

    public sendMessage(type: string, payload: any, params: ISendMessageParams) { /**/ }
    public messages(): Rx.Observable<Message> { return new Rx.Observable<Message>(); }
    public finalizeMission(walletPrivateKey: string) { /**/ }
}
