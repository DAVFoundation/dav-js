"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParams_1 = require("./BasicParams");
class CommitmentConfirmationParams extends BasicParams_1.default {
    constructor(values) {
        super(CommitmentConfirmationParams._protocol, CommitmentConfirmationParams._type, values);
        if (!!values) {
            this.bidId = values.bidId;
        }
    }
    static getMessageType() {
        return CommitmentConfirmationParams._type;
    }
    static getMessageProtocol() {
        return CommitmentConfirmationParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            bidId: this.bidId,
            isConfirmed: true,
        });
        return formattedParams;
    }
    getProtocolTypes() {
        const typeMap = {};
        typeMap[CommitmentConfirmationParams._type] = CommitmentConfirmationParams;
        typeMap.messages = [CommitmentConfirmationParams._type];
        return typeMap;
    }
    deserialize(json) {
        super.deserialize(json);
        this.bidId = json.bidId;
    }
}
CommitmentConfirmationParams._protocol = 'general';
CommitmentConfirmationParams._type = 'commitment-confirmation';
exports.default = CommitmentConfirmationParams;

//# sourceMappingURL=CommitmentConfirmationParams.js.map
