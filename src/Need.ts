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
        await Kafka.sendParams(neederId, bidParams, this._config);
        return new Bid<V>(bidderId, bidParams, this._config);
    }
    /**
     * @method bids Used to subscribe for bids for the current need.
     * @returns Observable for bids subscription.
     */
    public async bids<V extends BidParams>(): Promise<Observable<Bid<V>>> {
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._selfId, this._config); // this._selfId - Channel#3
        const bidParamsStream = kafkaMessageStream.filterType(this._params.getProtocolTypes().bid);
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
     * @returns Observable for messages subscription.
     */
    public async messages(): Promise<Observable<Message<MessageParams>>> {
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._selfId, this._config);
        const messageParamsStream: Observable<MessageParams> = kafkaMessageStream.filterType(this._params.getProtocolTypes().message);
        const messageStream: RxObservable<Message<MessageParams>> = messageParamsStream.map((params: MessageParams) =>
            new Message<MessageParams>(this._selfId, params, this._config));
        return Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
}
