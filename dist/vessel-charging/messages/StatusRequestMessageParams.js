"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
/**
 * @class The Class boat-charging/StatusRequestMessageParams represent the parameters of boat-charging status request message.
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
MessageParams._type = 'status_request_message';
exports.default = MessageParams;

//# sourceMappingURL=StatusRequestMessageParams.js.map
