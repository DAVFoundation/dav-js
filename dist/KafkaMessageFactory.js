"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageCategories;
(function (MessageCategories) {
    MessageCategories["NeedFilter"] = "NeedFilter";
    MessageCategories["Need"] = "Need";
    MessageCategories["Bid"] = "Bid";
    MessageCategories["Mission"] = "Mission";
    MessageCategories["Message"] = "Message";
})(MessageCategories = exports.MessageCategories || (exports.MessageCategories = {}));
class KafkaMessageFactory {
    constructor() {
        this.protocolMap = {};
    }
    static get instance() {
        if (!KafkaMessageFactory._instance) {
            KafkaMessageFactory._instance = new KafkaMessageFactory();
        }
        return KafkaMessageFactory._instance;
    }
    getProtocol(protocol) {
        if (!this.protocolMap[protocol]) {
            this.protocolMap[protocol] = {
                messageTypesMap: {},
                classTypesMap: {},
            };
        }
        return this.protocolMap[protocol];
    }
    registerClassType(protocol, messageType, classType) {
        const classTypesMap = this.getProtocol(protocol).classTypesMap;
        classTypesMap[messageType] = classType;
    }
    registerMessageCategory(protocol, messageType, messageCategory) {
        const messageTypesMap = this.getProtocol(protocol).messageTypesMap;
        if (!messageTypesMap[messageCategory]) {
            messageTypesMap[messageCategory] = [];
        }
        messageTypesMap[messageCategory].push(messageType);
    }
    getClassType(protocol, messageType) {
        const classTypesMap = this.getProtocol(protocol).classTypesMap;
        return classTypesMap[messageType];
    }
    getMessageTypes(protocol, category) {
        const messageTypesMap = this.getProtocol(protocol).messageTypesMap;
        return messageTypesMap[category];
    }
    registerMessageClassAndCategory(protocol, messageType, messageCategory, classType) {
        this.registerClassType(protocol, messageType, classType);
        this.registerMessageCategory(protocol, messageType, messageCategory);
    }
    registerMessageClasses(messageClasses) {
        messageClasses.forEach(messageClass => this.registerMessageClassAndCategory(messageClass.protocol, messageClass.messageType, messageClass.messageCategory, messageClass.classType));
    }
}
exports.default = KafkaMessageFactory;

//# sourceMappingURL=KafkaMessageFactory.js.map
