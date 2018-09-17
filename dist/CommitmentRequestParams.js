"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParams_1 = require("./BasicParams");
class CommitmentRequestParams extends BasicParams_1.default {
    constructor(values) {
        super(CommitmentRequestParams._protocol, CommitmentRequestParams._type, values);
        if (!!values) {
            this.neederId = values.neederId;
        }
    }
    static getMessageType() {
        return CommitmentRequestParams._type;
    }
    static getMessageProtocol() {
        return CommitmentRequestParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            neederId: this.neederId,
        });
        return formattedParams;
    }
    getProtocolTypes() {
        const typeMap = {};
        typeMap[CommitmentRequestParams._type] = CommitmentRequestParams;
        typeMap.messages = [CommitmentRequestParams._type];
        return typeMap;
    }
    deserialize(json) {
        super.deserialize(json);
        this.neederId = json.neederId;
    }
}
CommitmentRequestParams._protocol = 'general';
CommitmentRequestParams._type = 'commitment-request';
exports.default = CommitmentRequestParams;

//# sourceMappingURL=CommitmentRequestParams.js.map
