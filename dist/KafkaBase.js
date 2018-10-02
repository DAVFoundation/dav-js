"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class KafkaBase {
    generateTopicId() {
        return uuid_1.v4();
    }
}
exports.default = KafkaBase;

//# sourceMappingURL=KafkaBase.js.map
