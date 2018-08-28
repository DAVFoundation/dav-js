import { KafkaClient, Producer, Consumer } from 'kafka-node';
import IConfig from './IConfig';
import { Observable } from './common-types';
import { timeout } from 'promise-timeout';
import BasicParams from './BasicParams';
import { Observer } from 'rxjs';
import KafkaMessageStream, { IKafkaMessage } from './KafkaMessageStream';
import KafkaBase from './KafkaBase';

export default class Kafka extends KafkaBase {

    // TODO: Close consumers + observers

    private static _kafkaConnectionTimeoutInMs: number = 4500;
    private static _kafkaRequestTimeoutInMs: number = 4500;


    private static getKafkaClient(config: IConfig): KafkaClient {
        // TODO: make sure what is the correct way to use kafka seed url, and check other constructor options here
        const client = new KafkaClient({ kafkaHost: config.kafkaSeedUrls[0], connectTimeout: 6000, requestTimeout: 6000 });
        return client;
    }

    private static getProducer(config: IConfig): Promise<Producer> {
        const client = this.getKafkaClient(config);
        const producer = new Producer(client);
        const producerReadyPromise = new Promise<Producer>((resolve, reject) => {
            producer.on('ready', () => resolve(producer));
            producer.on('error', () => reject('Producer got error in connection'));
        });

        return timeout(producerReadyPromise, this._kafkaConnectionTimeoutInMs);
    }

    private static getConsumer(topicId: string, config: IConfig): Promise<Consumer> {
        const client = this.getKafkaClient(config);
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

        const clientReadyPromise = new Promise<Consumer>((resolve, reject) => {
            client.on('ready', () => resolve(consumer));
            client.on('error', () => reject('client got error in connection'));
        });
        return timeout(clientReadyPromise, this._kafkaConnectionTimeoutInMs);
    }

    public static async createTopic(topicId: string, config: IConfig): Promise<void> {
        const producer = await this.getProducer(config);
        const createTopicPromise = new Promise<void>((resolve, reject) => {
            producer.createTopics([topicId], true, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        return timeout(createTopicPromise, this._kafkaRequestTimeoutInMs);
    }

    public static async sendParams(topicId: string, basicParams: BasicParams, config: IConfig): Promise<void> {
        const producer = await this.getProducer(config);
        const payloads = [
            { topic: topicId, messages: JSON.stringify(basicParams.serialize())},
        ];
        const sendPromise = new Promise<void>((resolve, reject) => {
            producer.send(payloads, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        return timeout(sendPromise, this._kafkaRequestTimeoutInMs);
    }

    public static async messages(topicId: string, config: IConfig): Promise<KafkaMessageStream> {
        const consumer = await this.getConsumer(topicId, config);
        const kafkaStream: Observable<IKafkaMessage> = Observable.create((observer: Observer<IKafkaMessage>) => {
            consumer.on('message', (message) => {
                try {
                    const messageString = message.value.toString();
                    const messageObject = JSON.parse(messageString);
                    const messageType = [messageObject.protocol, messageObject.type].join(':');
                    observer.next({
                        messageType,
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


