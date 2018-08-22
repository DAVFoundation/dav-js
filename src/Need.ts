import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import NeedParams from './NeedParams';
import Bid from './Bid';
import { MessageParams } from './MessageParams';
import Kafka from './Kafka';
import Message from './Message';
import KafkaMessageStream from './KafkaMessageStream';

/**
 * @class The Need class represent a service request.
 */
export default class Need<T extends NeedParams, U extends MessageParams> {

    get params(): T {
        return this._params;
    }

    constructor(private _selfId: ID, private _params: T, private _config: IConfig) {
        /**/
    }

    /**
     * @method createBid Used to create a new bid for the current need and publish it to the service consumer.
     * @param bidParams The bid parameters.
     * @returns The created bid.
     */
    public async createBid<V extends BidParams>(bidParams: V): Promise<Bid<V, U>> {
        const neederId = this._params.id; // Channel#3
        const bidderId = Kafka.generateTopicId(); // Channel#6
        bidParams.id = bidderId;
        try {
            await Kafka.createTopic(bidderId, this._config);
        } catch (err) {
            // TODO: move this general message to kafka.createTopic
            throw new Error(`Fail to create a topic: ${err}`);
        }
        await Kafka.sendParams(neederId, bidParams, this._config);
        return new Bid<V, U>(bidderId, bidParams, this._config);
    }
    /**
     * @method bids Used to subscribe for bids for the current need.
     * @param bidParamsType The expected bid param object type.
     * @returns Observable for bids subscription.
     */
    public async bids<V extends BidParams>(bidParamsType: new (...all: any[]) => V): Promise<Observable<Bid<V, U>>> {
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._selfId, this._config);
        const bidParamsStream = kafkaMessageStream.filterType(bidParamsType);
        const bidStream = bidParamsStream.map((bidParams) => new Bid(this._selfId, bidParams, this._config)); // this._selfId - Channel#3
        return Observable.fromObservable(bidStream, this._params.id);
    }
    /**
     * @method sendMessage Used to send a message to the service consumer.
     * @param params The message parameters.
     */
    public async sendMessage(params: U): Promise<void> {
        if (this._selfId === this._params.id) {
            throw new Error(`You cannot send message to your own channel`);
        }
        params.senderId = this._selfId; // Channel#2
        return await Kafka.sendParams(this._params.id, params, this._config); // Channel#3
    }
    /**
     * @method messages Used to subscribe for messages for the current need.
     * @param messageParamsType The expected mission param object type.
     * @returns Observable for messages subscription.
     */
    public async messages(messageParamsType: new (...all: any[]) => U): Promise<Observable<Message<U>>> {
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._selfId, this._config);
        const messageParamsStream: Observable<U> = kafkaMessageStream.filterType(messageParamsType);
        const messageStream = messageParamsStream.map((params: MessageParams) =>
            new Message<U>(this._selfId, params, this._config));
        return Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
}
