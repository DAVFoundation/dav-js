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
    filterType<T extends BasicParams>(protocolTypesMap: any, typesFilter: string[]): Observable<T>;
}
//# sourceMappingURL=KafkaMessageStream.d.ts.map