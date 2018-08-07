import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import NeedParams from './NeedParams';
import Bid from './Bid';
import MessageParams from './MessageParams';
import Kafka from './Kafka';

export default class Need<T extends NeedParams> {

    // TODO: replace id with needParams
    constructor(public id: ID, private config: IConfig) {
        /**/
    }
    public async createBid<U extends BidParams, V extends MessageParams>(params: U): Promise<Bid<U, V>> {
        await Kafka.sendParams(this.id, params, this.config);
        return new Bid<U, V>(this.id, params.bidderId, params, this.config);
    }

    public async bids<U extends BidParams, V extends MessageParams>(): Promise<Observable<Bid<U, V>>> {
        const kafkaStream = await Kafka.paramsStream<U>(this.id, this.config);
        const bidStream = kafkaStream.map((bidParams) => new Bid(this.id, bidParams.bidderId, bidParams, this.config));
        return Observable.fromObservable(bidStream, this.id);
    }

    // TODO: add sendMessage(params: MessageParams): Promise<void>

    // TODO: Add messages<...>(): Promise<Observable<Message<...>>>
}
