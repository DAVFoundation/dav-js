import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import NeedParams from './NeedParams';
import Bid from './Bid';
import MessageParams from './MessageParams';
import Kafka from './Kafka';
import Message from './Message';
import KafkaMessageStream from './KafkaMessageStream';
import { Observable as RxObservable } from 'rxjs';
import KafkaMessageFactory, { MessageCategories } from './KafkaMessageFactory';

/**
 * @class The Need class represent a service request.
 */
export default class Need<T extends NeedParams> {

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
    public async createBid<V extends BidParams>(bidParams: V): Promise<Bid<V>> {
        const neederId = this._params.id; // Channel#3
        const bidderId = Kafka.generateTopicId(); // Channel#6
        bidParams.id = bidderId;
        bidParams.neederDavId = this._params.davId;
        try {
            await Kafka.createTopic(bidderId, this._config);
        } catch (err) {
            // TODO: move this general message to kafka.createTopic
            throw new Error(`Fail to create a topic: ${err}`);
        }
        const bid = new Bid<V>(bidderId, bidParams, this._config, await Kafka.messages(bidderId, this._config));
        await Kafka.sendParams(neederId, bidParams, this._config);
        return bid;
    }
    /**
     * @method bids Used to subscribe for bids for the current need.
     * @returns Observable for bids subscription.
     */
    public async bids<V extends BidParams>(): Promise<Observable<Bid<V>>> {
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._selfId, this._config); // this._selfId - Channel#3
        const bidParamsStream = kafkaMessageStream.filterType(
            KafkaMessageFactory.instance.getMessageTypes(this._params.protocol, MessageCategories.Bid));
        const bidStream: RxObservable<Bid<V>> = bidParamsStream.map((bidParams: V) => {
            return new Bid(this._selfId, bidParams, this._config, kafkaMessageStream);
        });
        return Observable.fromObservable(bidStream, this._params.id);
    }
    /**
     * @method sendMessage Used to send a message to the service consumer.
     * @param params The message parameters.
     */
    public async sendMessage(params: MessageParams): Promise<void> {
        if (this._selfId === this._params.id) {
            throw new Error(`You cannot send message to your own channel`);
        }
        params.senderId = this._selfId; // Channel#2
        return await Kafka.sendParams(this._params.id, params, this._config); // Channel#3
    }
    /**
     * @method messages Used to subscribe for messages for the current need.
     * @param filterType (optional) array of the expected message params object type.
     * @returns Observable for messages subscription.
     */
    public async messages<U extends MessageParams>(filterType?: string[]): Promise<Observable<Message<U>>> {
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._selfId, this._config);
        const messageParamsStream: Observable<U> = kafkaMessageStream.filterType(
            filterType || KafkaMessageFactory.instance.getMessageTypes(this._params.protocol, MessageCategories.Message));
        const messageStream: RxObservable<Message<U>> = messageParamsStream.map((params: U) =>
            new Message<U>(this._selfId, params, this._config));
        return Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
}
