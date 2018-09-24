"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
/**
 * @class The Class boat-charging/ChargingStartedMessageParams represent the parameters of provider notifying that charging has begun.
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
        const messageParams = super.deserialize(json);
    }
}
MessageParams._type = 'charging_started_message';
exports.default = MessageParams;

//# sourceMappingURL=ChargingStartedMessageParams.js.map
