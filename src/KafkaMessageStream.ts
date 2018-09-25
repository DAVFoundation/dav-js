import { Observable } from './common-types';
import BasicParams from './BasicParams';
import KafkaMessageFactory from './KafkaMessageFactory';

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

    public filterType<T extends BasicParams>(typesFilter: string[]): Observable<T> {
        return Observable.fromObservable<T>(this.kafkaStream
            .filter(message => typesFilter.includes(message.type))
            .map(message => {
                const protocol = KafkaMessageFactory.instance.getClassType<T>(message.protocol, message.type);
                return KafkaMessageStream.fromJson(protocol, message.contents);
            }), this.kafkaStream.topic);
    }
}
