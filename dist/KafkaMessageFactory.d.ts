export declare enum MessageCategories {
    NeedFilter = "NeedFilter",
    Need = "Need",
    Bid = "Bid",
    Mission = "Mission",
    Message = "Message"
}
export default class KafkaMessageFactory {
    private static _instance;
    private protocolMap;
    static readonly instance: KafkaMessageFactory;
    private constructor();
    private getProtocol;
    private registerClassType;
    private registerMessageCategory;
    getClassType<T>(protocol: string, messageType: string): new (...all: any[]) => T;
    getMessageTypes(protocol: string, category: MessageCategories): string[];
    registerMessageClass<T>(protocol: string, messageType: string, messageCategory: MessageCategories, classType: new (...all: any[]) => T): void;
    registerMessageClasses(messageClasses: Array<{
        protocol: string;
        messageType: string;
        messageCategory: MessageCategories;
        classType: new (...all: any[]) => any;
    }>): void;
}
