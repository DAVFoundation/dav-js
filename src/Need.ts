import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import NeedParams from './NeedParams';
import Bid from './Bid';
import MessageParams from './MessageParams';
import Kafka from './Kafka';

export default class Need<T extends NeedParams> {

    constructor(public id: ID, public needTypeId: ID, private config: IConfig) {
        /**/
    }
    public async createBid<U extends BidParams, V extends MessageParams>(params: U): Promise<Bid<U, V>> {
        const topicId = Kafka.generateTopicId();
        await Kafka.createTopic(topicId, this.config);
        params.sourceId = topicId;
        await Kafka.sendParams(topicId, params, this.config);
        return new Bid<U, V>(this.id, this.needTypeId, params, this.config);
    }

    public async bids<U extends BidParams, V extends MessageParams>(): Promise<Observable<Bid<U, V>>> {
        const kafkaStream = await Kafka.paramsStream<U>(this.id, this.config);
        const bidStream = kafkaStream.map((bidParams) => new Bid(this.id, bidParams.sourceId, bidParams, this.config));
        return Observable.fromObservable(bidStream, this.id);
    }
}
