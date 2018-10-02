"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Kafka_1 = require("./Kafka");
const CommitmentConfirmationParams_1 = require("./CommitmentConfirmationParams");
class CommitmentRequest {
    constructor(_bidId, _commitmentRequestParams, _config) {
        this._bidId = _bidId;
        this._commitmentRequestParams = _commitmentRequestParams;
        this._config = _config;
        /** */
    }
    async confirm() {
        const commitmentConfirmationParams = new CommitmentConfirmationParams_1.default({ bidId: this._bidId });
        await Kafka_1.default.sendParams(this._commitmentRequestParams.neederId, commitmentConfirmationParams, this._config);
    }
}
exports.default = CommitmentRequest;

//# sourceMappingURL=CommitmentRequest.js.map
