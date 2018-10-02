"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("./MessageParams");
/**
 * @class The Class MissionPeerIdMessageParams represent internal message from provider to consumer to announce his mission selfId.
 */
class MissionPeerIdMessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MissionPeerIdMessageParams._protocol, MissionPeerIdMessageParams._messageType, values);
    }
    serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
MissionPeerIdMessageParams._protocol = '';
MissionPeerIdMessageParams._messageType = 'mission_peer_id_message';
exports.default = MissionPeerIdMessageParams;

//# sourceMappingURL=MissionPeerIdMessageParams.js.map
