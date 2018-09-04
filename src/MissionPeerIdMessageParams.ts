import BaseMessageParams from './MessageParams';

/**
 * @class The Class MessageParams represent common parameters of MessageParams classes.
 */
export default class MissionPeerIdMessageParams extends BaseMessageParams {

    private static _protocol = 'general';
    private static _type = 'mission_peer_id_message';

    public static getMessageType(): string {
        return MissionPeerIdMessageParams._type;
    }

    public static getMessageProtocol(): string {
        return MissionPeerIdMessageParams._protocol;
    }

    constructor(values?: Partial<MissionPeerIdMessageParams>) {
        super(MissionPeerIdMessageParams._protocol, MissionPeerIdMessageParams._type, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public getProtocolTypes() {
        const typeMap: any = {};
        typeMap[MissionPeerIdMessageParams._type] = MissionPeerIdMessageParams;
        typeMap.messages = [MissionPeerIdMessageParams._type];
        return typeMap;
    }

    public  deserialize(json: any): void {
        super.deserialize(json);
    }
}
