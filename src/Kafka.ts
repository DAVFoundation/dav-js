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
        return new Promise<void>((resolve, reject) => {
            producer.createTopics([topicId], true, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static async sendParams(topicId: string, basicParams: BasicParams, config: IConfig) {
        const producer = await this.getProducer(config);
        const payloads = [
            { topic: topicId, messages: basicParams.toJson()},
        ];
        return new Promise<void>((resolve, reject) => {
            producer.send(payloads, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static paramsStream<T extends BasicParams>(topic: string, davId: DavID, config: IConfig): SDKObservable<T> {
        const consumer = this.createConsumer(topic, davId, config);
        const bidParamsPromise = new Promise<T>((resolve) => {
            consumer.on('message', (message) => {
                const messageString = message.value.toString();
                const messageObject = JSON.parse(messageString);
                const classEnum = [messageObject.protocol, messageObject.type].join(':') as ClassType;
                const fromJsonMethod = this._classEnumToMethod.get(classEnum);
                const finalObjectFromStream = fromJsonMethod(messageString);
                resolve(finalObjectFromStream);
            });
        });
        const rxObservable = SDKObservable.fromPromise(bidParamsPromise);
        const bidParamsObservable = rxObservable as SDKObservable<T>;
        bidParamsObservable.topic = topic;
        return bidParamsObservable;
    }

    private static _kafkaConnectionTimeoutInMs: number = 4500;
    private static _kafkarequestTimeoutInMs: number = 4500;

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
        const producerReadyPromise = new Promise<Producer>((resolve) => {
            producer.on('ready', () => resolve(producer));
        });

        return this.createPromiseWithTimeout(producerReadyPromise, this._kafkaConnectionTimeoutInMs, 'connection timeout');
    }

    private static createConsumer(topic: string, davId: DavID, config: IConfig): Consumer {
        const client = this.getKafkaClient(config);
        const consumer = new Consumer(
            client,
            [
                { topic },
            ],
            {
                groupId: davId,
                autoCommit: true,
            },
        );
        return consumer;
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


