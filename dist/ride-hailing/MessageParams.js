"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for all messages except OnTheWay message.
 */
class MessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MessageParams._protocol, MessageParams._type, values);
        if (!!values) {
            this.missionStatus = values.missionStatus;
        }
    }
    static getMessageType() {
        return MessageParams._type;
    }
    static getMessageProtocol() {
        return MessageParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            missionStatus: this.missionStatus,
        });
        return formattedParams;
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
    deserialize(json) {
        super.deserialize(json);
        this.missionStatus = json.missionStatus;
    }
}
MessageParams._protocol = 'ride_hailing';
MessageParams._type = 'message';
exports.default = MessageParams;

//# sourceMappingURL=MessageParams.js.map
