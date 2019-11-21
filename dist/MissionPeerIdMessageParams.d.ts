import BaseMessageParams from './MessageParams';
/**
 * @class The Class MissionPeerIdMessageParams represent internal message from provider to consumer to announce his mission selfId.
 */
export default class MissionPeerIdMessageParams extends BaseMessageParams {
    static _protocol: string;
    static _messageType: string;
    constructor(values?: Partial<MissionPeerIdMessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=MissionPeerIdMessageParams.d.ts.map