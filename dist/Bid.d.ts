import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import MissionParams from './MissionParams';
import MessageParams from './MessageParams';
import Message from './Message';
import Mission from './Mission';
import KafkaMessageStream from './KafkaMessageStream';
import CommitmentRequest from './CommitmentRequest';
import CommitmentConfirmation from './CommitmentConfirmation';
/**
 * @class Bid class represent a bid for service request.
 */
export default class Bid<T extends BidParams> {
    private _selfId;
    private _params;
    private _config;
    private kafkaMessageStream?;
    private _missionId;
    private _kafkaMessageStream;
    readonly params: T;
    readonly id: ID;
    constructor(_selfId: ID, _params: T, _config: IConfig, kafkaMessageStream?: KafkaMessageStream);
    private getKafkaMessageStream;
    requestCommitment(): Promise<CommitmentConfirmation>;
    /**
     * @method accept Used to accept a bid and create a new mission, the mission will sent to the bid provider.
     * @param missionParams the mission parameters.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns the created mission.
     */
    accept<V extends MissionParams>(missionParams: V, walletPrivateKey: string): Promise<Mission<V>>;
    /**
     * @method sendMessage Used to send a message to the bid provider.
     * @param messageParams the message parameters.
     */
    sendMessage(messageParams: MessageParams): Promise<void>;
    /**
     * @method messages Used to subscribe for messages for the current bid.
     * @param filterTypes (optional) array of the expected message params object type.
     * @returns Observable for messages subscription.
     */
    messages<U extends MessageParams>(filterTypes?: string[]): Promise<Observable<Message<U>>>;
    /**
     * @method missions Used to subscribe for missions.
     * @returns Observable for missions subscription.
     */
    missions<V extends MissionParams>(): Promise<Observable<Mission<V>>>;
    /**
     * @method commitmentRequests Used to subscribe for commitmentRequests for current bid.
     * @returns Observable of commitmentRequests.
     */
    commitmentRequests(): Promise<Observable<CommitmentRequest>>;
}
//# sourceMappingURL=Bid.d.ts.map