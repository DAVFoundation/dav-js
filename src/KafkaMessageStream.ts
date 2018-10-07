import { Observable } from './common-types';
import BasicParams from './BasicParams';
import KafkaMessageFactory from './KafkaMessageFactory';
import sdkLogger from './sdkLogger';

export interface IKafkaMessage {
  protocol: string;
  type: string;
  contents: string;
}

export default class KafkaMessageStream {
  private static fromJson<T extends BasicParams>(
    classType: new (...all: any[]) => T,
    json: any,
  ): T {
    const objectInstance = new classType.prototype.constructor();
    objectInstance.deserialize(JSON.parse(json));
    return objectInstance;
  }

  constructor(private kafkaStream: Observable<IKafkaMessage>) { }

  public filterType<T extends BasicParams>(
    typesFilter: string[],
  ): Observable<T> {
    return Observable.fromObservable<T>(
      this.kafkaStream
        .filter(message => typesFilter.includes(message.type))
        .map(message => {
          const classType = KafkaMessageFactory.instance.getClassType<T>(
            message.protocol,
            message.type,
          );
          sdkLogger(`KafkaMessageStream message on ${this.kafkaStream.topic} with class type ${classType.name}`);
          return KafkaMessageStream.fromJson(classType, message.contents);
        }),
      this.kafkaStream.topic,
    );
  }
}
