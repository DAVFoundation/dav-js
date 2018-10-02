"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KafkaBase_1 = require("./KafkaBase");
const axios_1 = require("axios");
const common_types_1 = require("./common-types");
const KafkaMessageStream_1 = require("./KafkaMessageStream");
class Kafka extends KafkaBase_1.default {
    async createTopic(topicId, config) {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `http://${config.apiSeedUrls[0]}/topic/create/${topicId}`;
        const response = await axios_1.default.post(fullEndpoint);
        if (response.status === 200) {
            return Promise.resolve();
        }
        return Promise.reject(response.data.error);
    }
    async sendParams(topicId, basicParams, config) {
        // TODO: make sure what is the correct way to use api seed url
        const fullEndpoint = `http://${config.apiSeedUrls[0]}/topic/publish/${topicId}`;
        try {
            const response = await axios_1.default.post(fullEndpoint, JSON.stringify(basicParams.serialize()), { headers: { 'Content-Type': 'application/json' } });
            if (response.status === 200) {
                return Promise.resolve();
            }
            return Promise.reject(response.data.error);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async messages(topicId, config) {
        if (!config.kafkaBrowserRequestTimeout) {
            config.kafkaBrowserRequestTimeout = 500;
        }
        if (!config.kafkaBrowserPollingInterval) {
            config.kafkaBrowserPollingInterval = 1000;
        }
        // TODO: make sure what is the correct way to use api seed url
        const messagesUrl = `http://${config.apiSeedUrls[0]}/topic/consume/${topicId}?timeout=${config.kafkaBrowserRequestTimeout}`;
        const kafkaStream = common_types_1.Observable.create((observer) => {
            const sendRequest = async () => {
                try {
                    const messages = await axios_1.default.get(messagesUrl);
                    if (messages.status !== 200) {
                        observer.error(messages.data.error);
                        return;
                    }
                    messages.data.forEach((message) => {
                        const messageString = JSON.parse(message);
                        observer.next({
                            protocol: messageString.protocol,
                            type: messageString.type,
                            contents: message,
                        });
                    });
                }
                catch (error) {
                    observer.error(error);
                }
            };
            sendRequest();
            // TODO: set ttl
            common_types_1.Observable.interval(config.kafkaBrowserPollingInterval).map(() => sendRequest());
        });
        return new KafkaMessageStream_1.default(kafkaStream);
    }
}
exports.default = Kafka;

//# sourceMappingURL=KafkaApi.js.map
