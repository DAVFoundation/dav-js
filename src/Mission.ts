import { ID, Observable, DavID } from './common-types';
import { TransactionReceipt } from 'web3/types';
import IConfig from './IConfig';
import Message from './Message';
import MessageParams from './MessageParams';
import BidParams from './BidParams';
import Contracts from './Contracts';
import Kafka from './Kafka';
import Bid from './Bid';

export default class Mission<T extends MessageParams, U extends BidParams> {

    constructor(public selfId: ID, public peerId: ID, public neederDavId: DavID, public bid: Bid<U, T>, private config: IConfig) {
    }

    public async sendMessage(params: MessageParams): Promise<void> {
        params.senderId = this.selfId;
        return Kafka.sendParams(this.peerId, params, this.config);
    }

    public async messages(): Promise<Observable<Message<T, U>>> {
        const stream = await Kafka.paramsStream(this.selfId, this.config);
        const observable = Observable.fromObservable(stream.map((params: MessageParams) =>
            new Message<T, U>(this.selfId, this.bid, this, params, this.config)), stream.topic);
        return observable;
    }

    public async finalizeMission(walletPrivateKey: string): Promise<TransactionReceipt> {
        return Contracts.finalizeMission(this.selfId, this.neederDavId, walletPrivateKey, this.config);
    }
}
