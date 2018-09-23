"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
/**
 * @class The Class boat-charging/ChargingCompleteMessageParams represent the parameters of boat-charging complete charging message.
 */
class MessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MessageParams._type, values);
    }
    static getMessageType() {
        return MessageParams._type;
    }
    serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
MessageParams._type = 'charging_complete_message';
exports.default = MessageParams;

//# sourceMappingURL=ChargingCompleteMessageParams.js.map
