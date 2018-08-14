import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import NeedParams from './NeedParams';
import Bid from './Bid';
import MessageParams from './MessageParams';
import Kafka from './Kafka';
import Message from './Message';

/**
 * @class The DavSDK Need class represent a service request.
 */
export default class Need<T extends NeedParams, U extends MessageParams> {

    get params(): T {
        return this._params;
    }

    constructor(private _selfId: ID, private _params: T, private config: IConfig) {
        /**/
    }
    /**
     * @method createBid Used to create a new bid for the current need and publish it to the service consumer.
     * @param params the bid parameters.
     * @returns the created bid.
     */
    public async createBid<V extends BidParams>(params: V): Promise<Bid<V, U>> {
        const neederId = this._params.id; // Channel#3
        const biderId = Kafka.generateTopicId(); // Channel#6
        params.id = biderId;
        params.needTypeId = this._selfId;
        try {
            await Kafka.createTopic(biderId, this.config);
        } catch (err) {
            throw new Error(`Fail to create a topic: ${err}`);
        }
        await Kafka.sendParams(neederId, params, this.config);
        return new Bid<V, U>(biderId, params, this.config);
    }
    /**
     * @method bids Used to subscribe to bids for the current need.
     * @returns Observable for bids subscription.
     */
    public async bids<V extends BidParams>(): Promise<Observable<Bid<V, U>>> {
        const kafkaStream: Observable<V> = await Kafka.paramsStream(this._params.id, this.config); // Channel#3
        const bidStream = kafkaStream.map((bidParams) => new Bid(this._selfId, bidParams, this.config));
        return Observable.fromObservable(bidStream, this._params.id);
    }
    /**
     * @method sendMessage Used to send a message to the need consumer.
     * @param params the message parameters.
     */
    public async sendMessage(params: U): Promise<void> {
        if (this._selfId === this._params.id) {
            throw new Error(`You cannot send message to yore own channel`);
        }
        params.senderId = this._selfId; // Channel#2
        return Kafka.sendParams(this._params.id, params, this.config); // Channel#3
    }
    /**
     * @method messages Used to subscribe to messages for the current need.
     * @returns Observable for messages subscription.
     */
    public async messages(): Promise<Observable<Message<U>>> {
        const stream = await Kafka.paramsStream(this._params.id, this.config); // Channel#3
        const messageStream = stream.map((params: MessageParams) =>
            new Message<U>(this._selfId, params, this.config));
        return Observable.fromObservable(messageStream, stream.topic);
    }
}
