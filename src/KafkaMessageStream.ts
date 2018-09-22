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

    constructor(private kafkaStream: Observable<IKafkaMessage>) { }

    public filterType<T extends BasicParams>(protocolTypesMap: any, typesFilter: string[]): Observable<T> {
        return Observable.fromObservable<T>(this.kafkaStream
            .filter(message => typesFilter.includes(message.type))
            .map(message => {
                const protocol = protocolTypesMap[message.type];
                return KafkaMessageStream.fromJson(protocol, message.contents);
            }), this.kafkaStream.topic);
    }
}
