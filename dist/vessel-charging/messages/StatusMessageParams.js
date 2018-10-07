"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
/**
 * @class The Class vessel-charging/StatusMessageParams represent the parameters of vessel-charging consumer status message.
 */
class MessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MessageParams._messageType, values);
        if (!!values) {
            if (!values.location) {
                throw new Error('location is a required field');
            }
            this.location = values.location;
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            location: this.location,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.location = json.location;
    }
}
MessageParams._messageType = 'vessel_status_message';
exports.default = MessageParams;

//# sourceMappingURL=StatusMessageParams.js.map
