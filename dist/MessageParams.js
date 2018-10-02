"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParams_1 = require("./BasicParams");
/**
 * @class The abstract Class MessageParams represent common parameters of MessageParams classes.
 */
class MessageParams extends BasicParams_1.default {
    constructor(protocol, type, values) {
        super(protocol, type, values);
        if (!!values) {
            this.senderId = values.senderId;
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, { senderId: this.senderId });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.senderId = json.senderId;
    }
}
exports.default = MessageParams;

//# sourceMappingURL=MessageParams.js.map
