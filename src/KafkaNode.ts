import { KafkaClient, Producer, Consumer } from 'kafka-node';
import IConfig from './IConfig';
import { Observable, IKafka } from './common-types';
import BasicParams from './BasicParams';
import { Observer } from 'rxjs';
import KafkaMessageStream, { IKafkaMessage } from './KafkaMessageStream';
import KafkaBase from './KafkaBase';

export default class Kafka extends KafkaBase implements IKafka {

    // TODO: Close consumers + observers

    private async getKafkaClient(config: IConfig): Promise<KafkaClient> {
        // TODO: make sure what is the correct way to use kafka seed url, and check other constructor options here
        const client = new KafkaClient({ kafkaHost: config.kafkaSeedUrls[0] });
        return new Promise<KafkaClient>((resolve, reject) => {
            client.on('ready', () => resolve(client));
            client.on('error', (err) => reject(err));
        });
    }

    private async getProducer(config: IConfig): Promise<Producer> {
        const client = await this.getKafkaClient(config);
        const producer = new Producer(client);
        return producer;
    }

    private async getConsumer(topicId: string, config: IConfig): Promise<Consumer> {
        const client = await this.getKafkaClient(config);
        const consumer = new Consumer(
            client,
            [
                { topic: topicId },
            ],
            {
                groupId: topicId,
                autoCommit: true,
            },
        );
        return consumer;
    }

    public async createTopic(topicId: string, config: IConfig): Promise<void> {
        const client = await this.getKafkaClient(config);
        await new Promise<void>((resolve, reject) => {
            (client as any).createTopics([{ topic: topicId, partitions: 1, replicationFactor: 1 }], (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
                client.close();
            });
        });
    }

    public async sendParams(topicId: string, basicParams: BasicParams, config: IConfig): Promise<void> {
        const producer = await this.getProducer(config);
        const payloads = [
            { topic: topicId, messages: JSON.stringify(basicParams.serialize()) },
        ];
        const sendPromise = new Promise<void>((resolve, reject) => {
            producer.send(payloads, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    producer.close();
                    resolve();
                }
            });
        });
        return sendPromise;
    }

    public async messages(topicId: string, config: IConfig): Promise<KafkaMessageStream> {
        const consumer = await this.getConsumer(topicId, config);
        const kafkaStream: Observable<IKafkaMessage> = Observable.create((observer: Observer<IKafkaMessage>) => {
            consumer.on('message', (message) => {
                try {
                    const messageString = message.value.toString();
                    const messageObject = JSON.parse(messageString);
                    observer.next({
                        type: messageObject.type,
                        protocol: messageObject.protocol,
                        contents: messageString,
                    });
                } catch (error) {
                    observer.error(`error while trying to parse message. topic: ${topicId} error: ${error}, message: ${message}`);
                }
            });
        });
        return new KafkaMessageStream(kafkaStream);
    }
}
