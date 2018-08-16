// TODO: remove unused imports
import { ID, Observable, DavID } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import MissionParams from './MissionParams';
import MessageParams from './MessageParams';
import Message from './Message';
import Mission from './Mission';
import Kafka from './Kafka';
import Contracts from './Contracts';
import KafkaMessageStream from './KafkaMessageStream';
/**
 * @class Bid class represent a bid for service request.
 */
export default class Bid<T extends BidParams, U extends MessageParams> {

    private _missionId: ID;

    get params(): T {
        return this._params;
    }

    // TODO: private members should start with underscore
    constructor(private _selfId: ID, private _params: T, private config: IConfig) {
        /**/
    }
    /**
     * @method accept Used to accept a bid and create a new mission, the mission will sent to the bid provider.
     * @param params the mission parameters.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns the created mission.
     */
    // TODO: think why do mission params is a parameter of this method? does mission params have another source of information except bid params?
    // TODO: rename 'params' to 'missionParams', might be very confusing with this._params
    public async accept<V extends MissionParams>(params: V, walletPrivateKey: string): Promise<Mission<V, U>> {
        const needTypeId = this._params.needTypeId;
        params.id = Kafka.generateTopicId(); // Channel#4
        params.price = this._params.price;
        this._missionId = params.id;
        try {
            await Contracts.approveMission(params.neederDavId, walletPrivateKey, this.config);
        } catch (err) {
            throw new Error(`Fail to approve mission, you might not have enough DAV Tokens: ${err}`);
        }
        try {
            await Kafka.createTopic(params.id, this.config);
        } catch (err) {
            // TODO: move this general message to kafka.createTopic
            throw new Error(`Fail to create a topic: ${err}`);
        }
        await Kafka.sendParams(needTypeId, params, this.config);
        const mission = new Mission<V, U>(this._missionId, params, this.config);
        return mission;
    }
    /**
     * @method sendMessage Used to send a message to the bid provider.
     * @param params the message parameters.
     */
    // TODO: rename params to messageParams
    public async sendMessage(params: MessageParams): Promise<void> {
        if (this._selfId === this._params.id) {
            throw new Error(`You cannot send message to your own channel`);
        }
        params.senderId = this._selfId; // Channel#3
        // TODO: should await this call or remove the async keyword
        return Kafka.sendParams(this._params.id, params, this.config); // Channel#6
    }
    /**
     * @method messages Used to subscribe for messages for the current bid.
     * @param messageParamsType The expected message params object type.
     * @returns Observable for messages subscription.
     */
    public async messages(messageParamsType: new (...all: any[]) => U): Promise<Observable<Message<U>>> {
        // TODO: rename stream to messageParamsStream (or another more meaningful name)
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._params.id, this.config); // Channel#6
        const messageParamsStream: Observable<U> = kafkaMessageStream.filterType(messageParamsType);
        const messageStream = messageParamsStream.map((params: MessageParams) =>
            new Message<U>(this._selfId, params, this.config));
        return Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
}

