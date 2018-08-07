import { ID, Observable, DavID } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import Message from './Message';
import Mission from './Mission';
import Kafka from './Kafka';
import Contracts from './Contracts';
import { v4 as uuidV4 } from 'uuid';
import MessageParams from './MessageParams';

export default class Bid<T extends BidParams, U extends MessageParams> {
    // TODO: rename _topicId to missionId
    private _topicId: string;
    private _mission: Mission<U, T>;

    get params(): T {
        return this._params;
    }

    // TODO: remove needId and needTypeId
    constructor(public needId: ID, public needTypeId: ID, private _params: T, private config: IConfig) {
        /**/
    }

    public async accept(messageParams: U): Promise<void> {
        this._topicId = Kafka.generateTopicId();
        await Kafka.createTopic(this._topicId, this.config);
        messageParams.senderId = this._topicId;
        // TODO: return Mission
        // TODO: send to bidder.id rather then neederId
        return await Kafka.sendParams(this.needId, messageParams, this.config);
    }

    // TODO: move this to Mission
    public async signContract(walletPrivateKey: string, neederDavId: DavID): Promise<Mission<U, T>> {
        if (!this._topicId) {
            throw new Error('Cannot sign on contract before bid is accepted');
        }
        const approveReceipt = await Contracts.approveMission(neederDavId, walletPrivateKey, this.config);
        // TODO: rename missionID -> contractMissionId
        const missionId = uuidV4();
        const createReceipt = await Contracts.startMission(missionId, neederDavId, walletPrivateKey, this._params.vehicleId,
             this._params.price.value, this.config);
        this._mission = new Mission(this._topicId, this.needTypeId, neederDavId, this, this.config);
        return this._mission;
    }

    // TODO: Adapt to new flow
    public async messages(): Promise<Observable<Message<U, T>>> {
        if (!this._topicId || !this._mission) {
            throw new Error('No messages available, please accept the bid, and sign the contract before you try to get messages');
        }
        const kafkaStream = await Kafka.paramsStream<U>(this._topicId, this.config);

        const messageStream = kafkaStream.map((messageParams) => {
            const message = new Message<U, T>(this._topicId, this, this._mission, messageParams, this.config);
            return message;
        });
        return Observable.fromObservable(messageStream, this._topicId);
    }

    // TODO: add sendMessage(params: MessageParams): Promise<void>
}

