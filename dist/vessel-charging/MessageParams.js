"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging message.
 */
class MessageParams extends MessageParams_1.default {
    constructor(messageType, values) {
        super(MessageParams._protocol, messageType, values);
    }
    static getMessageProtocol() {
        return MessageParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
MessageParams._protocol = 'boat_charging';
exports.default = MessageParams;

//# sourceMappingURL=MessageParams.js.map
