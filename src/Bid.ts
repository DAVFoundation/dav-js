import { ID, Observable, DavID } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import MissionParams from './MissionParams';
import MessageParams from './MessageParams';
import Message from './Message';
import Mission from './Mission';
import Kafka from './Kafka';
import Contracts from './Contracts';

export default class Bid<T extends BidParams, U extends MessageParams> {

    private _missionId: ID;

    get params(): T {
        return this._params;
    }

    constructor(private _selfId: ID, private _params: T, private config: IConfig) {
        /**/
    }
    /**
     * @method accept Used to accept a bid and create a new mission, the mission will send to the bid provider.
     * @param params the mission parameters.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns the created mission.
     */
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
    public async sendMessage(params: MessageParams): Promise<void> {
        if (this._selfId === this._params.id) {
            throw new Error(`You cannot send message to yore own channel`);
        }
        params.senderId = this._selfId; // Channel#3
        return Kafka.sendParams(this._params.id, params, this.config); // Channel#6
    }
    /**
     * @method messages Used to subscribe to messages for the current bid.
     * @returns Observable for messages subscription.
     */
    public async messages(): Promise<Observable<Message<U>>> {
        const stream: Observable<U> = await Kafka.paramsStream(this._params.id, this.config); // Channel#6
        const messageStream = stream.map((params: MessageParams) =>
            new Message<U>(this._selfId, params, this.config));
        return Observable.fromObservable(messageStream, stream.topic);
    }
}

