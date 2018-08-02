import { ID, Observable, DavID } from './common-types';
import { MessageDomain, MessageStatus } from './common-enums';
import IConfig from './IConfig';
import Message from './Message';
import MessageParams from './MessageParams';
import BidParams from './BidParams';
import Contracts from './Contracts';
import Kafka from './Kafka';
import Bid from './Bid';
import { TransactionReceipt } from 'web3/types';

export default class Mission<T extends MessageParams, U extends BidParams> {

    constructor(public selfId: ID, public peerId: ID, public neederDavId: DavID, public bid: Bid<U, T>, private config: IConfig) {
    }

    public async sendMessage(type: string, payload: any, params: MessageParams): Promise<void> {
        return Kafka.sendParams(this.peerId, params, this.config);
    }

    public async messages(): Promise<Observable<Message<T, U>>> {
        const stream = await Kafka.paramsStream(this.selfId, this.config);
        const observable = Observable.create((observer: any) => {
            stream.subscribe((params: MessageParams) => {
                const message = new Message(this.selfId, this.peerId, this.bid, this, params, this.config);
                observer.next(message);
            },
            (err: any) => observer.error(err));
        });
        return observable;
    }

    public async finalizeMission(walletPrivateKey: string): Promise<TransactionReceipt> {
        return Contracts.finalizeMission(this.selfId, this.neederDavId, walletPrivateKey, this.config);
    }
}
