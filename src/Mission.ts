import { ID, Observable, DavID } from './common-types';
import { TransactionReceipt } from 'web3/types';
import IConfig from './IConfig';
import Message from './Message';
import MessageParams from './MessageParams';
import MissionParams from './MissionParams';
import Contracts from './Contracts';
import Kafka from './Kafka';
/**
 * @class Mission class represent an approved mission.
 */
export default class Mission<T extends MissionParams, U extends MessageParams> {

    constructor(private _selfId: ID, private _params: T, private config: IConfig) {
    }
    /**
     * @method signContract Used to transfer tokens to the basicMission contract in order to start the mission.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns Ethereum transaction receipt.
     */
    public async signContract(walletPrivateKey: string): Promise<TransactionReceipt> {
        const transactionReceipt = await Contracts.startMission(this._params.id, this._params.neederDavId, walletPrivateKey, this._params.vehicleId,
            this._params.price.value, this.config);
        return transactionReceipt;
    }
    /**
     * @method finalizeMission Used to approve the mission is completed,
     * and transfer the tokens from the basicMission contract to the service provider.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns Ethereum transaction receipt object.
     */
    public async finalizeMission(walletPrivateKey: string): Promise<TransactionReceipt> {
        return Contracts.finalizeMission(this._params.id, this._params.neederDavId, walletPrivateKey, this.config);
    }
    /**
     * @method sendMessage Used to send message to the service consumer.
     * @param params message parameters.
     */
    public async sendMessage(params: MessageParams): Promise<void> {
        if (this._selfId === this._params.id) {
            throw new Error(`You cannot send message to yore own channel`);
        }
        params.senderId = this._selfId;
        return Kafka.sendParams(this._params.id, params, this.config); // Channel#4
    }
    /**
     * @method messages Used to subscribe for messages from the service provider.
     * @returns Observable object.
     */
    public async messages(): Promise<Observable<Message<U>>> {
        const stream = await Kafka.paramsStream(this._params.id, this.config); // Channel#4
        const messageStream = stream.map((params: MessageParams) =>
            new Message<U>(this._selfId, params, this.config));
        return Observable.fromObservable(messageStream, stream.topic);
    }
}
