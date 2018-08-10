import { KafkaClient, Producer, Consumer } from 'kafka-node';
import IConfig from './IConfig';
import { Observable } from './common-types';
import { timeout } from 'promise-timeout';
import DroneDeliveryNeedParams from './drone-delivery/NeedParams';
import DroneDeliveryBidParams from './drone-delivery/BidParams';
import DroneChargingNeedParams from './drone-charging/NeedParams';
import DroneChargingBidParams from './drone-charging/BidParams';
import BasicParams from './BasicParams';
import { v4 as uuidV4 } from 'uuid';
import { Observer } from 'rxjs';
import KafkaMessageStream, { IKafkaMessage } from './KafkaMessageStream';

enum ClassType {

    DroneDeliveryNeed = 'drone-delivery:need',
    DroneDeliveryBid = 'drone-delivery:bid',
    DroneChargingNeed = 'drone-charging:need',
    DroneChargingBid = 'drone-charging:bid',
}
export default class Kafka {

    // TODO: Close consumers + observers

    private static _classEnumToMethod: Map<ClassType, (json: string) => BasicParams> = new Map(
        [
            [ClassType.DroneChargingBid, DroneChargingBidParams.fromJson],
            [ClassType.DroneChargingNeed, DroneChargingNeedParams.fromJson],
        ],
    );

    private static _kafkaConnectionTimeoutInMs: number = 4500;
    private static _kafkaRequestTimeoutInMs: number = 4500;

    private static getKafkaClient(config: IConfig): KafkaClient {
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

    public static generateTopicId(): string {
        return uuidV4();
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

    public static async sendParams(topicId: string, basicParams: BasicParams, config: IConfig) {
        const producer = await this.getProducer(config);
        const payloads = [
            { topic: topicId, messages: basicParams.toJson() },
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

    public static async paramsStream<T extends BasicParams>(topicId: string, config: IConfig): Promise<Observable<T>> {
        const consumer = await this.getConsumer(topicId, config);
        const rxObservable = Observable.create((observer: Observer<T>) => {
            consumer.on('message', (message) => {
                try {
                    const messageString = message.value.toString();
                    const messageObject = JSON.parse(messageString);
                    const classEnum = [messageObject.protocol, messageObject.type].join(':') as ClassType;
                    const fromJsonMethod = this._classEnumToMethod.get(classEnum);
                    if (!!fromJsonMethod) {
                        const finalObjectFromStream = fromJsonMethod(messageString);
                        observer.next(finalObjectFromStream as T);
                    } else {
                        observer.error(`unrecognized message type, topic: ${message.topic}, message: ${message.value}`);
                    }
                } catch (error) {
                    observer.error(`error while trying to parse message. topic: ${topicId} error: ${error}, message: ${message}`);
                }
            });
        });
        const bidParamsObservable = Observable.fromObservable<T>(rxObservable, topicId);
        return bidParamsObservable;
    }
}


