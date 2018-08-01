import { ID, Observable, DavID } from './common-types';
import IConfig from './IConfig';
import Identity from './Identity';
import Message from './Message';
import MessageParams from './MessageParams';
import BidParams from './BidParams';
import Contracts from './Contracts';
import Kafka from './Kafka';

export default class Mission {

    constructor(public selfId: ID, public peerId: ID, public neederDavId: DavID, private config: IConfig) {
    }

    public async sendMessage(type: string, payload: any, params: MessageParams) {
        Kafka.sendParams(this.peerId, params, this.config);
    }

    public async messages<T extends MessageParams, U extends BidParams>(): Promise<Observable<Message<T, U>>> {
        const stream = await Kafka.paramsStream(this.selfId, this.config);
        const observable = Observable.create((observer: any) => {
            stream.subscribe((params) => {
                // const message = new Message(...params);
                // observer.next(message);
            });
        });
        return observable;
    }

    public async finalizeMission(walletPrivateKey: string) {
        Contracts.finalizeMission(this.selfId, this.neederDavId, walletPrivateKey, this.config);
    }
}
