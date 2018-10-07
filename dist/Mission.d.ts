import { ID, Observable } from './common-types';
import { TransactionReceipt } from 'web3/types';
import IConfig from './IConfig';
import Message from './Message';
import MessageParams from './MessageParams';
import MissionParams from './MissionParams';
/**
 * @class Mission class represent an approved mission.
 */
export default class Mission<T extends MissionParams> {
    private _selfId;
    private _peerId;
    private _params;
    private _config;
    readonly params: T;
    readonly id: ID;
    readonly peerId: ID;
    constructor(_selfId: ID, _peerId: ID, _params: T, _config: IConfig);
    /**
     * @method signContract Used to transfer tokens to the basicMission contract in order to start the mission.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns Ethereum transaction receipt.
     */
    signContract(walletPrivateKey: string): Promise<TransactionReceipt>;
    /**
     * @method finalizeMission Used to approve the mission is completed,
     * and transfer the tokens from the basicMission contract to the service provider.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns Ethereum transaction receipt object.
     */
    finalizeMission(walletPrivateKey: string): Promise<TransactionReceipt>;
    /**
     * @method sendMessage Used to send message to the service consumer.
     * @param params message parameters.
     */
    sendMessage(params: MessageParams): Promise<void>;
    /**
     * @method messages Used to subscribe for messages from the service provider.
     * @param filterType (optional) array of the expected message params object type.
     * @returns Observable object.
     */
    messages<U extends MessageParams>(filterType?: string[]): Promise<Observable<Message<MessageParams>>>;
}
//# sourceMappingURL=Mission.d.ts.map