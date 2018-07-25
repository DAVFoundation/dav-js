import { KafkaClient, Producer, Consumer } from 'kafka-node';
import IConfig from './IConfig';
import { DavID, Observable as SDKObservable } from './common-types';
import DroneDeliveryNeedParams from './drone-delivery/NeedParams';
import DroneDeliveryBidParams from './drone-delivery/BidParams';
import DroneChargingNeedParams from './drone-charging/NeedParams';
import DroneChargingBidParams from './drone-charging/BidParams';
import BasicParams from './BasicParams';

enum classType {
    droneDeliveryNeed = 'drone-delivery,need',
    droneDeliveryBid = 'drone-delivery,bid',
    droneChargingNeed = 'drone-charging,need',
    droneChargingBid = 'drone-charging,bid',
}

export default class Kafka {

    public static async createTopic(topic: string, config: IConfig) {
        const producer = await this.createProducer(config);
        producer.createTopics([topic], true, (err: any, data: any) => {
            if (err) {
                throw err;
            }
        });
        return new Promise<void>((resolve, reject) => {
            producer.createTopics([topic], true, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static async sendParams(topic: string, basicParams: BasicParams, config: IConfig) {
        const producer = await this.createProducer(config);
        const payloads = [
            { topic, messages: basicParams.toJson()},
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
                const classEnum = [messageObject.protocol, messageObject.type].join(',') as classType;
                const fromJsonMethod = this.classEnumToMethod.get(classEnum);
                const finalObjectFromStream = fromJsonMethod(messageString);
                resolve(finalObjectFromStream);
            });
        });
        const rxObservable = SDKObservable.fromPromise(bidParamsPromise);
        const bidParamsObservable = rxObservable as SDKObservable<T>;
        bidParamsObservable.topic = topic;
        return bidParamsObservable;
    }

    private static classEnumToMethod: Map<classType, (json: string) => any> = new Map(
        [
            [classType.droneChargingBid, DroneChargingBidParams.fromJson],
        ],
    );

    // todo: maybe delete this method
    private static createKafkaClient(config: IConfig): KafkaClient {
        // todo: change kafka host to config
        // const client = new KafkaClient({kafkaHost: config.kafkaSeedUrls});
        const client = new KafkaClient({kafkaHost: 'localhost:9092', connectTimeout: 6000, requestTimeout: 6000});
        return client;
    }

    private static createProducer(config: IConfig): Promise<Producer> {
        const client = this.createKafkaClient(config);
        const producer = new Producer(client);
        return new Promise<Producer>((resolve) => {
            producer.on('ready', () => {
                resolve(producer);
                console.log(`producer is ready`);
            });
        });
    }

    private static createConsumer(topic: string, davId: DavID, config: IConfig): Consumer {
        const client = this.createKafkaClient(config);
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
}


