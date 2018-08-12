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
import axios from 'axios';
const runningOnBrowser = process.env.BROWSER || false;

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

    private static async createTopicViaApi(topicId: string, config: IConfig): Promise<void> {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `${config.apiSeedUrls[0]}/topic/create/${topicId}`;
        const response = await axios.post(fullEndpoint);
        if (response.status === 200) {
            return Promise.resolve();
        }
        return Promise.reject(response.data.error);
    }

    private static async sendParamsViaApi(topicId: string, params: string, config: IConfig): Promise<void> {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `${config.apiSeedUrls[0]}/topic/publish/${topicId}`;
        try {
            const response = await axios.post(fullEndpoint, params);
            if (response.status === 200) {
                return Promise.resolve();
            }
            return Promise.reject(response.data.error);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private static paramsStreamViaApi<T extends BasicParams>(topicId: string, config: IConfig): Observable<T> {
        // TODO: make sure what is the correct way to use api seed url
        const messagesUrl = `${config.apiSeedUrls[0]}/topic/consume/${topicId}`;
        return Observable.create((observer: Observer<T>) => {
            const sendRequest = async () => {
                try {
                    const messages = await axios.get(messagesUrl);
                    if (messages.status !== 200) {
                        observer.error(messages.data.error);
                    } else {
                        const messageArray: any[] = JSON.parse(messages.data);
                        messageArray.forEach((message) => {
                            try {
                                const object = this.convertMessage<T>(JSON.stringify(message));
                                observer.next(object);
                            } catch (error) {
                                observer.error(error);
                            }
                        });
                    }
                } catch (error) {
                    observer.error(error);
                }
            };
            sendRequest();
            // TODO: set ttl
            setInterval(() => sendRequest(), config.kafkaPollingInterval);
        });
    }

    private static convertMessage<T extends BasicParams>(message: string): T {
        const messageObject = JSON.parse(message);
        const classEnum = [messageObject.protocol, messageObject.type].join(':') as ClassType;
        const fromJsonMethod = this._classEnumToMethod.get(classEnum);
        if (!!fromJsonMethod) {
            const finalObjectFromStream = fromJsonMethod(message);
            return finalObjectFromStream as T;
        } else {
            throw new Error(`unrecognized message type, message: ${message}`);
        }
    }

    public static generateTopicId(): string {
        return uuidV4();
    }

    public static async createTopic(topicId: string, config: IConfig): Promise<void> {
        if (runningOnBrowser) {
            return await this.createTopicViaApi(topicId, config);
        }
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
        const messageToSend = basicParams.toJson();
        if (runningOnBrowser) {
            return await this.sendParamsViaApi(topicId, messageToSend, config);
        }
        const producer = await this.getProducer(config);
        const payloads = [
            { topic: topicId, messages: messageToSend},
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
        if (runningOnBrowser) {
            return this.paramsStreamViaApi<T>(topicId, config);
        }
        const consumer = await this.getConsumer(topicId, config);
        // TODO: set ttl?
        const rxObservable = Observable.create((observer: Observer<T>) => {
            consumer.on('message', (message) => {
                try {
                    observer.next(this.convertMessage(message.value.toString()));
                } catch (error) {
                    observer.error(`error while trying to parse message. topic: ${topicId} error: ${error}, message: ${message}`);
                }
            });
        });
        const bidParamsObservable = Observable.fromObservable<T>(rxObservable, topicId);
        return bidParamsObservable;
    }
}


