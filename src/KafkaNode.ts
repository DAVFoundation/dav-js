import { KafkaClient, Producer, Consumer, Message } from 'kafka-node';
import IConfig from './IConfig';
import { Observable, IKafka } from './common-types';
import BasicParams from './BasicParams';
import { Subject, Observable as RxObservable } from 'rxjs';
import KafkaMessageStream, { IKafkaMessage } from './KafkaMessageStream';
import KafkaBase from './KafkaBase';
import { ProduceRequest } from 'kafka-node';
import { retryPromise } from '.';
import sdkLogger from './sdkLogger';

export default class Kafka extends KafkaBase implements IKafka {
  private async getKafkaClient(config: IConfig): Promise<KafkaClient> {
    return retryPromise(new Promise<KafkaClient>((resolve, reject) => {
      const client = new KafkaClient({ kafkaHost: config.kafkaSeedUrls[0] });
      client.connect();
      client.on('ready', () => {
        resolve(client);
      });
      client.on('error', err => {
        reject(err);
      });
    }));
  }

  private async getProducer(config: IConfig): Promise<Producer> {
    const client = await this.getKafkaClient(config);
    const producer = new Producer(client);
    return producer;
  }

  private async getConsumer(
    topicId: string,
    config: IConfig,
  ): Promise<Consumer> {
    const client = await this.getKafkaClient(config);
    const consumer = new Consumer(client, [{ topic: topicId }], {
      groupId: topicId,
      autoCommit: true,
    });
    return consumer;
  }

  public async createTopic(topicId: string, config: IConfig): Promise<void> {
    const client = await this.getKafkaClient(config);
    return retryPromise(new Promise<void>((resolve, reject) => {
      (client as any).createTopics(
        [{ topic: topicId, partitions: 1, replicationFactor: 1 }],
        (err: any, data: any) => {
          if (err) {
            sdkLogger(`Error creating topic ${topicId}`);
            reject(err);
          } else {
            sdkLogger(`Topic created ${topicId}`);
            resolve();
          }
        },
      );
    }));
  }

  public sendMessage(
    topicId: string,
    message: string,
    config: IConfig,
  ): Promise<void> {
    return this.sendPayloads([{ topic: topicId, messages: message }], config);
  }

  public async sendPayloads(
    payloads: ProduceRequest[],
    config: IConfig,
  ): Promise<void> {
    const producer = await this.getProducer(config);
    sdkLogger(`Sending ${JSON.stringify(payloads)}`);
    return retryPromise(new Promise<void>((resolve, reject) => {
      producer.send(payloads, (err: any, data: any) => {
        if (err) {
          sdkLogger(`Error sending ${JSON.stringify(payloads)}`);
          reject(err);
        } else {
          sdkLogger(`Sent ${JSON.stringify(payloads)}`);
          resolve();
        }
      });
    }));
  }

  public sendParams(
    topicId: string,
    basicParams: BasicParams,
    config: IConfig,
  ): Promise<void> {
    return this.sendMessage(
      topicId,
      JSON.stringify(basicParams.serialize()),
      config,
    );
  }

  public async rawMessages(
    topicId: string,
    config: IConfig,
  ): Promise<RxObservable<Message>> {
    const consumer = await this.getConsumer(topicId, config);
    const kafkaStream: Subject<Message> = new Subject<Message>();
    sdkLogger(`Listening on ${topicId}`);
    consumer.on('message', message => {
      try {
        sdkLogger(`Message on ${topicId}: ${JSON.stringify(message)}`);
        const messageString = message.value.toString();
        kafkaStream.next(message);
      } catch (error) {
        kafkaStream.error(
          `error while trying to parse message. topic: ${topicId} error: ${JSON.stringify(
            error,
          )}, message: ${JSON.stringify(message)}`,
        );
      }
    });
    consumer.on('error', err => {
      sdkLogger(`Consumer error on ${topicId}: ${JSON.stringify(err)}`);
      kafkaStream.error(
        `Consumer error. topic: ${topicId} error: ${JSON.stringify(err)}`,
      );
    });
    return kafkaStream;
  }

  public async messages(
    topicId: string,
    config: IConfig,
  ): Promise<KafkaMessageStream> {
    const stream = (await this.rawMessages(topicId, config)).map(message => {
      const messageString = message.value.toString();
      const messageObject = JSON.parse(messageString);
      return {
        type: messageObject.type,
        protocol: messageObject.protocol,
        contents: messageString,
      } as IKafkaMessage;
    });
    return new KafkaMessageStream(Observable.fromObservable(stream, topicId));
  }

  public async isConnected(config: IConfig) {
    await this.getKafkaClient(config);
    return true;
  }
}
