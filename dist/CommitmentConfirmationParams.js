"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParams_1 = require("./BasicParams");
class CommitmentConfirmationParams extends BasicParams_1.default {
    constructor(values) {
        super(CommitmentConfirmationParams._protocol, CommitmentConfirmationParams._messageType, values);
        if (!!values) {
            this.bidId = values.bidId;
        }
    }
    static getMessageType() {
        return CommitmentConfirmationParams._messageType;
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
        typeMap[CommitmentConfirmationParams._messageType] = CommitmentConfirmationParams;
        typeMap.messages = [CommitmentConfirmationParams._messageType];
        return typeMap;
    }
    deserialize(json) {
        super.deserialize(json);
        this.bidId = json.bidId;
    }
}
CommitmentConfirmationParams._protocol = '';
CommitmentConfirmationParams._messageType = 'commitment_confirmation';
exports.default = CommitmentConfirmationParams;

//# sourceMappingURL=CommitmentConfirmationParams.js.map
