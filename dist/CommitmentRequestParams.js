"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParams_1 = require("./BasicParams");
class CommitmentRequestParams extends BasicParams_1.default {
    constructor(values) {
        super(CommitmentRequestParams._protocol, CommitmentRequestParams._messageType, values);
        if (!!values) {
            this.neederId = values.neederId;
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            neederId: this.neederId,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.neederId = json.neederId;
    }
}
CommitmentRequestParams._protocol = '';
CommitmentRequestParams._messageType = 'commitment_request';
exports.default = CommitmentRequestParams;

//# sourceMappingURL=CommitmentRequestParams.js.map
