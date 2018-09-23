"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class drone-delivery/MessageParams represent the parameters of drone-delivery message.
 */
class MessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MessageParams._protocol, MessageParams._type, values);
    }
    static getMessageType() {
        return MessageParams._type;
    }
    static getMessageProtocol() {
        return MessageParams._protocol;
    }
    serialize() {
        return super.serialize();
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
MessageParams._protocol = 'drone_delivery';
MessageParams._type = 'message';
exports.default = MessageParams;

//# sourceMappingURL=MessageParams.js.map
