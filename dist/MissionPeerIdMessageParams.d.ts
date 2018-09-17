import BaseMessageParams from './MessageParams';
/**
 * @class The Class MissionPeerIdMessageParams represent internal message from provider to consumer to announce his mission selfId.
 */
export default class MissionPeerIdMessageParams extends BaseMessageParams {
    private static _protocol;
    private static _type;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<MissionPeerIdMessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    getProtocolTypes(): any;
    deserialize(json: any): void;
}
//# sourceMappingURL=MissionPeerIdMessageParams.d.ts.map