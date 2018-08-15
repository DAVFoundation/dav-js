import { Observable } from './common-types';
import BasicParams from './BasicParams';
import { copySync } from 'fs-extra';

export interface IKafkaMessage {
    messageType: string;
    contents: string;
}

export default class KafkaMessageStream {
    private static fromJson<T extends BasicParams>(classType: new (...all: any[]) => T, json: any): T {
        return (classType.prototype.constructor).fromJson(JSON.parse(json));
    }

    private static getMessageType<T extends BasicParams>(classType: new (...all: any[]) => T): string {
        return (classType.prototype.constructor).getMessageType();
    }

    constructor(private kafkaStream: Observable<IKafkaMessage>) { }

    public filterType<T extends BasicParams>(classType: new (...all: any[]) => T): Observable<T> {
        return Observable.fromObservable<T>(this.kafkaStream
            .filter((message) => {
                return KafkaMessageStream.getMessageType(classType) === message.messageType;
            })
            .map((message) => {
                return KafkaMessageStream.fromJson(classType, message.contents);
            }), this.kafkaStream.topic);
    }
}
