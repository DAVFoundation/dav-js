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

export default class Bid<T extends BidParams> {
    private _topicId: string;
    private _mission: Mission;

    get params(): T {
        return this._params;
    }

    constructor(public needId: ID, public needTypeId: ID, private _params: T, private config: IConfig) {
        /**/
    }

    public async accept() {
        this._topicId = Kafka.generateTopicId();
        Kafka.createTopic(this._topicId, this.config);
        // This line should be changed due to the decision what this params object should be and where it should be created,
        // and it probably should include the new topicId
        const params = new MessageParams({topicIdToReply: this._topicId});
        await Kafka.sendParams(this.needId, params, this.config);
    }

    public async signContract(walletPrivateKey: string, neederDavId: DavID): Promise<Mission> {
        const approveReceipt = await Contracts.approveMission(neederDavId, walletPrivateKey, this.config);
        const missionId = uuidV4();
        const createReceipt = await Contracts.startMission(missionId, neederDavId, walletPrivateKey, this._params.vehicleId,
             this._params.price.value, this.config);
        this._mission = new Mission(this._topicId, this.needTypeId, neederDavId, this.config);
        return this._mission;
    }

    public async messages(): Promise<Observable<Message<T>>> {
        if (!this._topicId || !this._mission) {
            throw new Error('No messages available, please accept the bid, and sign the contract before you try to get messages');
        }
        const kafkaStream = await Kafka.paramsStream<T>(this._topicId, this.config);
        const messageStream = kafkaStream.map((bidParams) => new Message<T>(this._topicId, this.needTypeId,
            // need to move some Message object members to MessageParams
            new Bid<T>(this.needId, this.needTypeId, bidParams, this.config), this._mission, MessageStatus.contractSigned,
            MessageDomain.mission, this.config));
        return Observable.fromObservable(messageStream, this._topicId);
    }
}

