import BaseMessageParams from './MessageParams';

/**
 * @class The Class MissionPeerIdMessageParams represent internal message from provider to consumer to announce his mission selfId.
 */
export default class MissionPeerIdMessageParams extends BaseMessageParams {
    public static _protocol = '';
    public static _messageType = 'mission_peer_id_message';

    constructor(values?: Partial<MissionPeerIdMessageParams>) {
        super(MissionPeerIdMessageParams._protocol, MissionPeerIdMessageParams._messageType, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public  deserialize(json: any): void {
        super.deserialize(json);
    }
}
