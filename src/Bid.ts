import { ID, Observable } from './common-types';
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

    constructor(private _selfId: ID, private _params: T, private _config: IConfig) {
        /**/
    }
    /**
     * @method accept Used to accept a bid and create a new mission, the mission will sent to the bid provider.
     * @param missionParams the mission parameters.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns the created mission.
     */
    // TODO: think why do mission params is a parameter of this method? does mission params have another source of information except bid params?
    public async accept<V extends MissionParams>(missionParams: V, walletPrivateKey: string): Promise<Mission<V, U>> {
        const needTypeId = this._params.needTypeId;
        missionParams.id = Kafka.generateTopicId(); // Channel#4
        missionParams.price = this._params.price;
        this._missionId = missionParams.id;
        try {
            await Contracts.approveMission(missionParams.neederDavId, walletPrivateKey, this._config);
        } catch (err) {
            throw new Error(`Fail to approve mission, you might not have enough DAV Tokens: ${err}`);
        }
        try {
            await Kafka.createTopic(missionParams.id, this._config);
        } catch (err) {
            // TODO: move this general message to kafka.createTopic
            throw new Error(`Fail to create a topic: ${err}`);
        }
        await Kafka.sendParams(needTypeId, missionParams, this._config);
        const mission = new Mission<V, U>(this._missionId, missionParams, this._config);
        return mission;
    }
    /**
     * @method sendMessage Used to send a message to the bid provider.
     * @param messageParams the message parameters.
     */
    public async sendMessage(messageParams: MessageParams): Promise<void> {
        if (this._selfId === this._params.id) {
            throw new Error(`You cannot send message to your own channel`);
        }
        messageParams.senderId = this._selfId; // Channel#3
        return await Kafka.sendParams(this._params.id, messageParams, this._config); // Channel#6
    }
    /**
     * @method messages Used to subscribe for messages for the current bid.
     * @param messageParamsType The expected message params object type.
     * @returns Observable for messages subscription.
     */
    public async messages(messageParamsType: new (...all: any[]) => U): Promise<Observable<Message<U>>> {
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._params.id, this._config); // Channel#6
        const messageParamsStream: Observable<U> = kafkaMessageStream.filterType(messageParamsType);
        const messageStream = messageParamsStream.map((params: MessageParams) =>
            new Message<U>(this._selfId, params, this._config));
        return Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
}

