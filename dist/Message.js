"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Kafka_1 = require("./Kafka");
/**
 * @class The Message Class represent a single message between consumer and service provider.
 */
class Message {
    constructor(selfId, _params, config) {
        this.selfId = selfId;
        this._params = _params;
        this.config = config;
        /* */
    }
    get params() {
        return this._params;
    }
    /**
     * @method respond Used to reply for the current message.
     * @param params the message parameters.
     */
    respond(params) {
        params.senderId = this.selfId;
        return Kafka_1.default.sendParams(this._params.senderId, params, this.config);
    }
    /**
     * @method getMessageType Used to check the message type and protocol.
     */
    getMessageType() {
        const formattedParams = this._params.serialize();
        return `${formattedParams.protocol}:${formattedParams.type}`;
    }
}
exports.default = Message;

//# sourceMappingURL=Message.js.map
