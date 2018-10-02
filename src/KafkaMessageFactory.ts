export enum MessageCategories {
  NeedFilter = 'NeedFilter',
  Need = 'Need',
  Bid = 'Bid',
  Mission = 'Mission',
  Message = 'Message',
}

interface IClassTypesMap {
  [messageType: string]: new (...all: any[]) => any;
}
interface IMessageTypesMap {
  [messageCategory: string]: string[];
}
interface IProtocolMapEntry {
  classTypesMap: IClassTypesMap;
  messageTypesMap: IMessageTypesMap;
}
interface IProtocolMap {
  [protocol: string]: IProtocolMapEntry;
}

export default class KafkaMessageFactory {
  private static _instance: KafkaMessageFactory;

  private protocolMap: IProtocolMap = {};

  public static get instance(): KafkaMessageFactory {
    if (!KafkaMessageFactory._instance) {
      KafkaMessageFactory._instance = new KafkaMessageFactory();
    }
    return KafkaMessageFactory._instance;
  }

  private constructor() {}

  private getProtocol(protocol: string): IProtocolMapEntry {
    if (!this.protocolMap[protocol]) {
      this.protocolMap[protocol] = {
        messageTypesMap: {},
        classTypesMap: {},
      };
    }
    return this.protocolMap[protocol];
  }

  private registerClassType<T>(
    protocol: string,
    messageType: string,
    classType: new (...all: any[]) => T,
  ): void {
    const classTypesMap = this.getProtocol(protocol).classTypesMap;
    classTypesMap[messageType] = classType;
  }

  private registerMessageCategory(
    protocol: string,
    messageType: string,
    messageCategory: MessageCategories,
  ): void {
    const messageTypesMap = this.getProtocol(protocol).messageTypesMap;
    if (!messageTypesMap[messageCategory]) {
      messageTypesMap[messageCategory] = [];
    }
    messageTypesMap[messageCategory].push(messageType);
  }

  public getClassType<T>(
    protocol: string,
    messageType: string,
  ): new (...all: any[]) => T {
    const classTypesMap = this.getProtocol(protocol).classTypesMap;
    return classTypesMap[messageType];
  }

  public getMessageTypes(
    protocol: string,
    category: MessageCategories,
  ): string[] {
    const messageTypesMap = this.getProtocol(protocol).messageTypesMap;
    return messageTypesMap[category];
  }

  public registerMessageClass<T>(
    protocol: string,
    messageType: string,
    messageCategory: MessageCategories,
    classType: new (...all: any[]) => T,
  ): void {
    this.registerClassType(protocol, messageType, classType);
    this.registerMessageCategory(protocol, messageType, messageCategory);
  }

  public registerMessageClasses(
    messageClasses: Array<{
      protocol: string;
      messageType: string;
      messageCategory: MessageCategories;
      classType: new (...all: any[]) => any;
    }>,
  ): void {
    messageClasses.forEach(messageClass =>
      this.registerMessageClass(
        messageClass.protocol,
        messageClass.messageType,
        messageClass.messageCategory,
        messageClass.classType,
      ),
    );
  }
}
