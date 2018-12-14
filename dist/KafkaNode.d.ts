import { Message } from 'kafka-node';
import IConfig from './IConfig';
import { IKafka } from './common-types';
import BasicParams from './BasicParams';
import { Observable as RxObservable } from 'rxjs';
import KafkaMessageStream from './KafkaMessageStream';
import KafkaBase from './KafkaBase';
import { ProduceRequest } from 'kafka-node';
export default class Kafka extends KafkaBase implements IKafka {
    private getKafkaClient;
    private getProducer;
    private getConsumer;
    createTopic(topicId: string, config: IConfig): Promise<void>;
    sendMessage(topicId: string, message: string, config: IConfig): Promise<void>;
    sendPayloads(payloads: ProduceRequest[], config: IConfig): Promise<void>;
    sendParams(topicId: string, basicParams: BasicParams, config: IConfig): Promise<void>;
    rawMessages(topicId: string, config: IConfig): Promise<RxObservable<Message>>;
    messages(topicId: string, config: IConfig): Promise<KafkaMessageStream>;
    isConnected(config: IConfig): Promise<boolean>;
}
