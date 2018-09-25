"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging provider status message.
 */
class MessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MessageParams._messageType, values);
        if (!!values) {
            if (!values.finishEta) {
                throw new Error('finishEta is a required field');
            }
            this.finishEta = values.finishEta;
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            finishEta: this.finishEta,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.finishEta = json.finishEta;
    }
}
MessageParams._messageType = 'provider_status_message';
exports.default = MessageParams;

//# sourceMappingURL=ProviderStatusMessageParams.js.map
