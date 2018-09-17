"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_types_1 = require("./common-types");
class KafkaMessageStream {
    constructor(kafkaStream) {
        this.kafkaStream = kafkaStream;
    }
    static fromJson(classType, json) {
        const objectInstance = new classType.prototype.constructor();
        objectInstance.deserialize(JSON.parse(json));
        return objectInstance;
    }
    filterType(protocolTypesMap, typesFilter) {
        return common_types_1.Observable.fromObservable(this.kafkaStream
            .filter((message) => typesFilter.includes(message.type))
            .map((message) => {
            const protocol = protocolTypesMap[message.type];
            return KafkaMessageStream.fromJson(protocol, message.contents);
        }), this.kafkaStream.topic);
    }
}
exports.default = KafkaMessageStream;

//# sourceMappingURL=KafkaMessageStream.js.map
