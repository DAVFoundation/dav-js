"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_types_1 = require("./common-types");
const KafkaMessageFactory_1 = require("./KafkaMessageFactory");
const sdkLogger_1 = require("./sdkLogger");
class KafkaMessageStream {
    constructor(kafkaStream) {
        this.kafkaStream = kafkaStream;
    }
    static fromJson(classType, json) {
        const objectInstance = new classType.prototype.constructor();
        objectInstance.deserialize(JSON.parse(json));
        return objectInstance;
    }
    filterType(typesFilter) {
        return common_types_1.Observable.fromObservable(this.kafkaStream
            .filter(message => typesFilter.includes(message.type))
            .map(message => {
            const classType = KafkaMessageFactory_1.default.instance.getClassType(message.protocol, message.type);
            sdkLogger_1.default(`KafkaMessageStream message on ${this.kafkaStream.topic} with class type ${classType.name}`);
            return KafkaMessageStream.fromJson(classType, message.contents);
        }), this.kafkaStream.topic);
    }
}
exports.default = KafkaMessageStream;

//# sourceMappingURL=KafkaMessageStream.js.map
