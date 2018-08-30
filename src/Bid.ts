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
    public async accept<V extends MissionParams>(missionParams: V, walletPrivateKey: string): Promise<Mission<V>> {
        const bidderId = this._params.id; // Channel#6
        missionParams.id = Contracts.generateMissionId(this._config); // Channel#4
        missionParams.price = this._params.price;
        missionParams.neederDavId = this._params.neederDavId;
        missionParams.vehicleId = this._params.vehicleId;
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
        await Kafka.sendParams(bidderId, missionParams, this._config);
        const mission = new Mission<V>(this._missionId, null, missionParams, this._config);
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
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._selfId, this._config); // Channel#6 or Channel#3
        const messageParamsStream: Observable<U> = kafkaMessageStream.filterType(messageParamsType);
        const messageStream = messageParamsStream.map((params: U) =>
            new Message<U>(this._selfId, params, this._config));
        return Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
    /**
     * @method missions Used to subscribe for missions.
     * @param missionParamsType The expected mission param object type.
     * @returns Observable for missions subscription.
     */
    public async missions<V extends MissionParams>(missionParamsType: new (...all: any[]) => V): Promise<Observable<Mission<V>>> {
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._selfId, this._config); // Channel#6
        const missionParamsStream: Observable<V> = kafkaMessageStream.filterType(missionParamsType);
        const missionStream = missionParamsStream
        .map(async (params: V) => {
            this._missionId = Kafka.generateTopicId();
            await Kafka.createTopic(this._missionId, this._config); // Channel #5
            return new Mission<V>(this._missionId, params.id, params, this._config);
        })
        .map((promise) => Observable.fromPromise(promise))
        .mergeAll()
        .do((mission) => {
            const message = new MessageParams({senderId: this._missionId});
            mission.sendMessage(message);
        });
        return Observable.fromObservable(missionStream, missionParamsStream.topic);
    }
}
