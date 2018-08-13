import KafkaBase from './KafkaBase';
import IConfig from './IConfig';
import axios from 'axios';
import BasicParams from './BasicParams';
import { Observable } from './common-types';
import { Observer } from 'rxjs';

export default class Kafka extends KafkaBase {

    public static async createTopic(topicId: string, config: IConfig): Promise<void> {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `${config.apiSeedUrls[0]}/topic/create/${topicId}`;
        const response = await axios.post(fullEndpoint);
        if (response.status === 200) {
            return Promise.resolve();
        }
        return Promise.reject(response.data.error);
    }

    public static async sendParams(topicId: string, basicParams: BasicParams, config: IConfig): Promise<void> {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `${config.apiSeedUrls[0]}/topic/publish/${topicId}`;
        try {
            const response = await axios.post(fullEndpoint, basicParams.toJson());
            if (response.status === 200) {
                return Promise.resolve();
            }
            return Promise.reject(response.data.error);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // public static async messages(topicId: string, config: IConfig): Promise<KafkaMessageStream> {
    //     const consumer = await this.getConsumer(topicId, config);
    //     const kafkaStream: Observable<IKafkaMessage> = Observable.create((observer: Observer<IKafkaMessage>) => {
    //         consumer.on('message', (message) => {
    //             try {
    //                 const messageString = message.value.toString();
    //                 const messageObject = JSON.parse(messageString);
    //                 const messageType = [messageObject.protocol, messageObject.type].join(':');
    //                 observer.next({
    //                     messageType,
    //                     contents: messageString,
    //                 });
    //             } catch (error) {
    //                 observer.error(`error while trying to parse message. topic: ${topicId} error: ${error}, message: ${message}`);
    //             }
    //         });
    //     });

    //     return new KafkaMessageStream(kafkaStream);
    // }

    public static async paramsStream<T extends BasicParams>(topicId: string, config: IConfig): Promise<Observable<T>> {
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
}
