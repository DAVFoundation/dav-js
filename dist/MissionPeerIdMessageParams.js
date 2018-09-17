"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("./MessageParams");
/**
 * @class The Class MissionPeerIdMessageParams represent internal message from provider to consumer to announce his mission selfId.
 */
class MissionPeerIdMessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MissionPeerIdMessageParams._protocol, MissionPeerIdMessageParams._type, values);
    }
    static getMessageType() {
        return MissionPeerIdMessageParams._type;
    }
    static getMessageProtocol() {
        return MissionPeerIdMessageParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }
    getProtocolTypes() {
        const typeMap = {};
        typeMap[MissionPeerIdMessageParams._type] = MissionPeerIdMessageParams;
        typeMap.messages = [MissionPeerIdMessageParams._type];
        return typeMap;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
MissionPeerIdMessageParams._protocol = 'general';
MissionPeerIdMessageParams._type = 'mission_peer_id_message';
exports.default = MissionPeerIdMessageParams;

//# sourceMappingURL=MissionPeerIdMessageParams.js.map
