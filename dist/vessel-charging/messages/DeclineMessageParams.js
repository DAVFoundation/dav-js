"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
/**
 * @class The Class vessel-charging/MessageParams represent the parameters of vessel-charging decline mission message.
 */
class MessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MessageParams._messageType, values);
    }
    serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
MessageParams._messageType = 'decline_message';
exports.default = MessageParams;

//# sourceMappingURL=DeclineMessageParams.js.map
