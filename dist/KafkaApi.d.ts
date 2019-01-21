import KafkaBase from './KafkaBase';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import { IKafka } from './common-types';
import KafkaMessageStream from './KafkaMessageStream';
export default class Kafka extends KafkaBase implements IKafka {
    createTopic(topicId: string, config: IConfig): Promise<void>;
    sendParams(topicId: string, basicParams: BasicParams, config: IConfig): Promise<void>;
    messages(topicId: string, config: IConfig): Promise<KafkaMessageStream>;
}
