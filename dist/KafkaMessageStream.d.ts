import { Observable } from './common-types';
import BasicParams from './BasicParams';
export interface IKafkaMessage {
    protocol: string;
    type: string;
    contents: string;
}
export default class KafkaMessageStream {
    private kafkaStream;
    private static fromJson;
    constructor(kafkaStream: Observable<IKafkaMessage>);
    filterType<T extends BasicParams>(typesFilter: string[]): Observable<T>;
}
