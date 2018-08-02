import { ID, Observable, DavID } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import Message from './Message';
import Mission from './Mission';
import Kafka from './Kafka';
import Contracts from './Contracts';
import { v4 as uuidV4 } from 'uuid';
// temporary import
import MessageParams from './drone-charging/MessageParams';
import { MessageStatus, MessageDomain } from './common-enums';

export default class Bid<T extends BidParams, U extends MessageParams> {
    private _topicId: string;
    private _mission: Mission<U, T>;

    get params(): T {
        return this._params;
    }

    constructor(public needId: ID, public needTypeId: ID, private _params: T, private config: IConfig) {
        /**/
    }

    public async accept(messageParams: U) {
        this._topicId = Kafka.generateTopicId();
        Kafka.createTopic(this._topicId, this.config);
        messageParams.sourceId = this._topicId;
        await Kafka.sendParams(this.needId, messageParams, this.config);
    }

    public async signContract(walletPrivateKey: string, neederDavId: DavID): Promise<Mission<U, T>> {
        const approveReceipt = await Contracts.approveMission(neederDavId, walletPrivateKey, this.config);
        const missionId = uuidV4();
        const createReceipt = await Contracts.startMission(missionId, neederDavId, walletPrivateKey, this._params.vehicleId,
             this._params.price.value, this.config);
        this._mission = new Mission(this._topicId, this.needTypeId, neederDavId, this, this.config);
        return this._mission;
    }

    public async messages(): Promise<Observable<Message<U, T>>> {
        if (!this._topicId || !this._mission) {
            throw new Error('No messages available, please accept the bid, and sign the contract before you try to get messages');
        }
        const kafkaStream = await Kafka.paramsStream<U>(this._topicId, this.config);

        const messageStream = kafkaStream.map((messageParams) => {
            const bid = new Bid<T, U>(this.needId, this.needTypeId, this._params, this.config);
            const message = new Message<U, T>(this._topicId, this.needTypeId, bid, this._mission, messageParams, this.config);
            return message;
        });
        return Observable.fromObservable(messageStream, this._topicId);
    }
}

