import KafkaBase from './KafkaBase';
import IConfig from './IConfig';
import axios from 'axios';
import BasicParams from './BasicParams';
import { Observable, IKafka } from './common-types';
import { Observer } from 'rxjs';
import KafkaMessageStream, { IKafkaMessage } from './KafkaMessageStream';

export default class Kafka extends KafkaBase implements IKafka {

    public async createTopic(topicId: string, config: IConfig): Promise<void> {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `http://${config.apiSeedUrls[0]}/topic/create/${topicId}`;
        const response = await axios.post(fullEndpoint);
        if (response.status === 200) {
            return Promise.resolve();
        }
        return Promise.reject(response.data.error);
    }

    public async sendParams(topicId: string, basicParams: BasicParams, config: IConfig): Promise<void> {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `http://${config.apiSeedUrls[0]}/topic/publish/${topicId}`;
        try {
            const response = await axios.post(fullEndpoint, JSON.stringify(basicParams.serialize()), {headers: {'Content-Type': 'application/json'}});
            if (response.status === 200) {
                return Promise.resolve();
            }
            return Promise.reject(response.data.error);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async messages(topicId: string, config: IConfig): Promise<KafkaMessageStream> {
        if (!config.kafkaBrowserRequestTimeout) {
            config.kafkaBrowserRequestTimeout = 500;
        }
        if (!config.kafkaBrowserPollingInterval) {
            config.kafkaBrowserPollingInterval = 1000;
        }
        // TODO: make sure what is the correct way to use api seed url
        const messagesUrl = `http://${config.apiSeedUrls[0]}/topic/consume/${topicId}?timeout=${config.kafkaBrowserRequestTimeout}`;
        const kafkaStream: Observable<IKafkaMessage> =  Observable.create((observer: Observer<IKafkaMessage>) => {
            const sendRequest = async () => {
                try {
                    const messages = await axios.get(messagesUrl);
                    if (messages.status !== 200) {
                        observer.error(messages.data.error);
                        return;
                    }
                    messages.data.forEach((message: string) => {
                        const messageString = JSON.parse(message);
                        observer.next({
                            protocol: messageString.protocol,
                            type: messageString.type,
                            contents: message,
                        });
                    });
                } catch (error) {
                    observer.error(error);
                }
            };
            sendRequest();
            // TODO: set ttl
            Observable.interval(config.kafkaBrowserPollingInterval).map(() => sendRequest());
        });
        return new KafkaMessageStream(kafkaStream);
    }
}
