"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
/**
 * @class The Class vessel-charging/ChargingArrivalMessageParams represent the parameters of vessel-charging arrival message.
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
MessageParams._messageType = 'charging_arrival_message';
exports.default = MessageParams;

//# sourceMappingURL=ChargingArrivalMessageParams.js.map
