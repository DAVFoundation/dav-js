import { KafkaClient, Producer, Consumer } from 'kafka-node';
import IConfig from './IConfig';
import { DavID, Observable as SDKObservable } from './common-types';
import DroneDeliveryNeedParams from './drone-delivery/NeedParams';
import DroneDeliveryBidParams from './drone-delivery/BidParams';
import DroneChargingNeedParams from './drone-charging/NeedParams';
import DroneChargingBidParams from './drone-charging/BidParams';
import BasicParams from './BasicParams';

enum ClassType {
    DroneDeliveryNeed = 'drone-delivery:need',
    DroneDeliveryBid = 'drone-delivery:bid',
    DroneChargingNeed = 'drone-charging:need',
    DroneChargingBid = 'drone-charging:bid',
}

export default class Kafka {

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
        return this.createPromiseWithTimeout(createTopicPromise, this._kafkaRequestTimeoutInMs, 'kafka request timeout');
    }

    public static async sendParams(topicId: string, basicParams: BasicParams, config: IConfig) {
        const producer = await this.getProducer(config);
        const payloads = [
            { topic: topicId, messages: basicParams.toJson()},
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
        return this.createPromiseWithTimeout(sendPromise, this._kafkaRequestTimeoutInMs, 'kafka request timeout');
    }

    public static async paramsStream<T extends BasicParams>(topicId: string, config: IConfig): Promise<SDKObservable<T>> {
        const consumer = await this.getConsumer(topicId, config);
        const bidParamsPromise = new Promise<T>((resolve) => {
            consumer.on('message', (message) => {
                const messageString = message.value.toString();
                const messageObject = JSON.parse(messageString);
                const classEnum = [messageObject.protocol, messageObject.type].join(':') as ClassType;
                const fromJsonMethod = this._classEnumToMethod.get(classEnum);
                // console.log(fromJsonMethod);
                const finalObjectFromStream = fromJsonMethod(messageString);
                // console.log(`final object is ${finalObjectFromStream}`);
                resolve(finalObjectFromStream);
            });
        });
        const rxObservable = SDKObservable.fromPromise(bidParamsPromise);
        const bidParamsObservable = SDKObservable.fromObservable(rxObservable, topicId);
        return bidParamsObservable;
    }

    private static _kafkaConnectionTimeoutInMs: number = 4500;
    private static _kafkaRequestTimeoutInMs: number = 4500;

    private static _classEnumToMethod: Map<ClassType, (json: string) => any> = new Map(
        [
            [ClassType.DroneChargingBid, DroneChargingBidParams.fromJson],
        ],
    );

    // todo: maybe delete this method
    private static getKafkaClient(config: IConfig): KafkaClient {
        const client = new KafkaClient({kafkaHost: config.kafkaSeedUrls[0], connectTimeout: 6000, requestTimeout: 6000});
        return client;
    }

    private static getProducer(config: IConfig): Promise<Producer> {
        const client = this.getKafkaClient(config);
        const producer = new Producer(client);
        const producerReadyPromise = new Promise<Producer>((resolve, reject) => {
            producer.on('ready', () => resolve(producer));
            producer.on('error', () => reject(producer));
        });

        return this.createPromiseWithTimeout(producerReadyPromise, this._kafkaConnectionTimeoutInMs, 'connection timeout');
    }

    private static getConsumer(topic: string, config: IConfig): Promise<Consumer> {
        const client = this.getKafkaClient(config);
        const consumer = new Consumer(
            client,
            [
                { topic },
            ],
            {
                groupId: topic,
                autoCommit: true,
            },
        );
        const clientReadyPromise = new Promise<Consumer>((resolve) => {
            client.on('ready', () => resolve(consumer));
        });
        return this.createPromiseWithTimeout(clientReadyPromise, this._kafkaConnectionTimeoutInMs, 'connection timeout');
    }

    private static createPromiseWithTimeout<T>(resolvablePromise: Promise<T>, timeout: number, errorMessage: string) {
        const timeoutPromise = new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() =>  {
                clearTimeout(timer);
                reject(errorMessage);
            }, timeout);
        });
        return Promise.race([resolvablePromise, timeoutPromise]);
    }
}


