import { ID, Observable, DavID } from './common-types';
import { TransactionReceipt } from 'web3/types';
import IConfig from './IConfig';
import Message from './Message';
import MessageParams from './MessageParams';
import GeneralMessageParams from './GeneralMessageParams';
import MissionParams from './MissionParams';
import Contracts from './Contracts';
import Kafka from './Kafka';
import KafkaMessageStream from './KafkaMessageStream';
/**
 * @class Mission class represent an approved mission.
 */
export default class Mission<T extends MissionParams> {

    public get params(): T {
        return this._params;
    }

    constructor(private _selfId: ID, private _peerId: ID, private _params: T, private _config: IConfig) {
    }

    private async getPeerId(): Promise<ID> {
        const messages = await this.messages(GeneralMessageParams);
        const peerId = new Promise<ID>((resolve, reject) => {
            messages.take(1).subscribe((message) => {
                this._peerId = message.messageParams.senderId;
                resolve(this._peerId);
            }, (err) => {
                reject(err);
            });
        });
        return peerId;
    }

    /**
     * @method signContract Used to transfer tokens to the basicMission contract in order to start the mission.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns Ethereum transaction receipt.
     */
    public async signContract(walletPrivateKey: string): Promise<TransactionReceipt> {
        try {
            const transactionReceipt = await Contracts.startMission(this._params.id, this._params.neederDavId, walletPrivateKey,
                this._params.vehicleId, this._params.price, this._config);
            return transactionReceipt;
        } catch (err) {
            throw new Error(`Fail to sign contract ${err}`);
        }
    }
    /**
     * @method finalizeMission Used to approve the mission is completed,
     * and transfer the tokens from the basicMission contract to the service provider.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns Ethereum transaction receipt object.
     */
    public async finalizeMission(walletPrivateKey: string): Promise<TransactionReceipt> {
        try {
            const transactionReceipt = await Contracts.finalizeMission(this._params.id, this._params.neederDavId, walletPrivateKey, this._config);
            return transactionReceipt;
        } catch (err) {
            throw new Error(`Fail to finalize mission ${err}`);
        }
    }
    /**
     * @method sendMessage Used to send message to the service consumer.
     * @param params message parameters.
     */
    public async sendMessage(params: MessageParams): Promise<void> {
        if (!this._peerId) {
            await this.getPeerId();
        }
        params.senderId = this._selfId;
        return await Kafka.sendParams(this._peerId, params, this._config); // Channel#4
    }
    /**
     * @method messages Used to subscribe for messages from the service provider.
     * @param MessageParams The expected message param object type.
     * @returns Observable object.
     */
    public async messages<U extends MessageParams>(messageParamsType: new (...all: any[]) => U): Promise<Observable<Message<U>>> {
        const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this._selfId, this._config); // Channel#4 or Channel#6
        const messageParamsStream = kafkaMessageStream.filterType(messageParamsType);
        const messageStream = messageParamsStream.map((params: U) => new Message<U>(this._selfId, params, this._config));
        return Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
}
