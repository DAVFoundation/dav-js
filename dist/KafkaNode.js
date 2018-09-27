"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafka_node_1 = require("kafka-node");
const common_types_1 = require("./common-types");
const rxjs_1 = require("rxjs");
const KafkaMessageStream_1 = require("./KafkaMessageStream");
const KafkaBase_1 = require("./KafkaBase");
const _1 = require(".");
class Kafka extends KafkaBase_1.default {
    async getKafkaClient(config) {
        return _1.retryPromise(new Promise((resolve, reject) => {
            const client = new kafka_node_1.KafkaClient({ kafkaHost: config.kafkaSeedUrls[0] });
            client.connect();
            client.on('ready', () => {
                resolve(client);
            });
            client.on('error', err => {
                reject(err);
            });
        }));
    }
    async getProducer(config) {
        const client = await this.getKafkaClient(config);
        const producer = new kafka_node_1.Producer(client);
        return producer;
    }
    async getConsumer(topicId, config) {
        const client = await this.getKafkaClient(config);
        const consumer = new kafka_node_1.Consumer(client, [{ topic: topicId }], {
            groupId: topicId,
            autoCommit: true,
        });
        return consumer;
    }
    async createTopic(topicId, config) {
        const client = await this.getKafkaClient(config);
        return _1.retryPromise(new Promise((resolve, reject) => {
            client.createTopics([{ topic: topicId, partitions: 1, replicationFactor: 1 }], (err, data) => {
                if (err) {
                    // tslint:disable-next-line:no-console
                    console.log(`Error creating topic ${topicId}`);
                    reject(err);
                }
                else {
                    // tslint:disable-next-line:no-console
                    console.log(`Topic created ${topicId}`);
                    resolve();
                }
            });
        }));
    }
    sendMessage(topicId, message, config) {
        return this.sendPayloads([{ topic: topicId, messages: message }], config);
    }
    async sendPayloads(payloads, config) {
        const producer = await this.getProducer(config);
        // tslint:disable-next-line:no-console
        console.log(`Sending ${JSON.stringify(payloads)}`);
        return _1.retryPromise(new Promise((resolve, reject) => {
            producer.send(payloads, (err, data) => {
                if (err) {
                    // tslint:disable-next-line:no-console
                    console.log(`Error sending ${JSON.stringify(payloads)}`);
                    reject(err);
                }
                else {
                    // tslint:disable-next-line:no-console
                    console.log(`Sent ${JSON.stringify(payloads)}`);
                    resolve();
                }
            });
        }));
    }
    sendParams(topicId, basicParams, config) {
        return this.sendMessage(topicId, JSON.stringify(basicParams.serialize()), config);
    }
    async rawMessages(topicId, config) {
        const consumer = await this.getConsumer(topicId, config);
        const kafkaStream = new rxjs_1.Subject();
        // tslint:disable-next-line:no-console
        console.log(`Listening on ${topicId}`);
        consumer.on('message', message => {
            try {
                // tslint:disable-next-line:no-console
                console.log(`Message on ${topicId}: ${JSON.stringify(message)}`);
                const messageString = message.value.toString();
                kafkaStream.next(message);
            }
            catch (error) {
                kafkaStream.error(`error while trying to parse message. topic: ${topicId} error: ${JSON.stringify(error)}, message: ${JSON.stringify(message)}`);
            }
        });
        consumer.on('error', err => {
            // tslint:disable-next-line:no-console
            console.log(`Consumer error on ${topicId}: ${JSON.stringify(err)}`);
            kafkaStream.error(`Consumer error. topic: ${topicId} error: ${JSON.stringify(err)}`);
        });
        return kafkaStream;
    }
    async messages(topicId, config) {
        const stream = (await this.rawMessages(topicId, config)).map(message => {
            const messageString = message.value.toString();
            const messageObject = JSON.parse(messageString);
            return {
                type: messageObject.type,
                protocol: messageObject.protocol,
                contents: messageString,
            };
        });
        return new KafkaMessageStream_1.default(common_types_1.Observable.fromObservable(stream, topicId));
    }
    async isConnected(config) {
        await this.getKafkaClient(config);
        return true;
    }
}
exports.default = Kafka;

//# sourceMappingURL=KafkaNode.js.map
