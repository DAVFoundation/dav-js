import KafkaBase from './KafkaBase';
import IConfig from './IConfig';
import axios from 'axios';
import BasicParams from './BasicParams';
import { Observable } from './common-types';
import { Observer } from 'rxjs';
import KafkaMessageStream, { IKafkaMessage } from './KafkaMessageStream';

export default class Kafka extends KafkaBase {

    public static async createTopic(topicId: string, config: IConfig): Promise<void> {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `http://${config.apiSeedUrls[0]}/topic/create/${topicId}`;
        const response = await axios.post(fullEndpoint);
        if (response.status === 200) {
            return Promise.resolve();
        }
        return Promise.reject(response.data.error);
    }

    public static async sendParams(topicId: string, basicParams: BasicParams, config: IConfig): Promise<void> {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `http://${config.apiSeedUrls[0]}/topic/publish/${topicId}`;
        try {
            const response = await axios.post(fullEndpoint, basicParams.toJson(), {headers: {'Content-Type': 'application/json'}});
            if (response.status === 200) {
                return Promise.resolve();
            }
            return Promise.reject(response.data.error);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public static async messages(topicId: string, config: IConfig): Promise<KafkaMessageStream> {
        if (!config.kafkaBrowserRequestTimeout) {
            config.kafkaBrowserRequestTimeout = 500;
        }
        if (!config.kafkaBrowserPollingInterval) {
            config.kafkaBrowserPollingInterval = 1000;
        }
        // TODO: make sure what is the correct way to use api seed url
        const messagesUrl = `http://${config.apiSeedUrls[0]}/topic/consume/${topicId}?timeout=${config.kafkaBrowserRequestTimeout}`;
        const kafkaStream: Observable<IKafkaMessage> =  Observable.create((observer: Observer<IKafkaMessage>) => {
            // CR_COMMENT: Might look better in a private function
            const sendRequest = async () => {
                try {
                    const messages = await axios.get(messagesUrl);
                    if (messages.status !== 200) {
                        observer.error(messages.data.error);
                        // CR_COMMENT: I think use return and save this else will be cleaner
                    } else {
                        messages.data.forEach((message: string) => {
                            const messageString = JSON.parse(message);
                            const messageType = [messageString.protocol, messageString.type].join(':');
                            observer.next({
                                messageType,
                                contents: message,
                            });
                        });
                    }
                } catch (error) {
                    observer.error(error);
                }
            };
            sendRequest();
            // TODO: set ttl
            // CR_COMMENT: Using rxObservable.interval will be better, you cn see example in Contracts.watchContract
            setInterval(() => sendRequest(), config.kafkaBrowserPollingInterval);
        });
        return new KafkaMessageStream(kafkaStream);
    }
}
