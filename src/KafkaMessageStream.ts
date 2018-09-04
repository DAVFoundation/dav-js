import { Observable } from './common-types';
import BasicParams from './BasicParams';

export interface IKafkaMessage {
    protocol: string;
    type: string;
    contents: string;
}

export default class KafkaMessageStream {
    private static fromJson<T extends BasicParams>(classType: new (...all: any[]) => T, json: any): T {
        const objectInstance = new classType.prototype.constructor();
        objectInstance.deserialize(JSON.parse(json));
        return objectInstance;
    }

    private static compareType<T extends BasicParams>(classType: any, messageType: string): boolean {
        if (typeof classType === 'object') {
            return !!classType[messageType];
        } else {
            return (classType.prototype.constructor).getMessageType() === messageType;
        }
    }

    constructor(private kafkaStream: Observable<IKafkaMessage>) { }

    public filterType<T extends BasicParams>(protocolTypesMap: any): Observable<T> {
        return Observable.fromObservable<T>(this.kafkaStream
            .filter((message) => KafkaMessageStream.compareType(protocolTypesMap, message.type))
            .map((message) => {
                const protocol = protocolTypesMap[message.type] || protocolTypesMap;
                return KafkaMessageStream.fromJson(protocol, message.contents);
            }), this.kafkaStream.topic);
    }
}
