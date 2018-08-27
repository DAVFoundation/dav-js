import { Observable, DavID, ID } from './common-types';
import IConfig from './IConfig';
import NeedFilterParams from './NeedFilterParams';
import NeedParams from './NeedParams';
import BidParams from './BidParams';
import MissionParams from './MissionParams';
import MessageParams from './MessageParams';
import Need from './Need';
import Bid from './Bid';
import Message from './Message';
import Mission from './Mission';
import Kafka from './Kafka';
import axios from 'axios';
import KafkaMessageStream from './KafkaMessageStream';
/**
 * @class The Identity class represent registered DAV identity instance.
 */
export default class Identity {

  private topics: any = {};

  constructor(public id: ID, public davId: DavID, private _config: IConfig) { /**/ }

  private async registerNewTopic() {
    const topic = Kafka.generateTopicId();
    try {
      await Kafka.createTopic(topic, this._config);
    } catch (err) {
      // TODO: move this general message to kafka class
      throw new Error(`Fail to create a topic: ${err}`);
    }
    return topic;
  }

  /**
   * @method publishNeed Used to create a new need and publish it to the relevant service providers.
   * @param params the need parameters.
   * @returns the created need.
   */
  public async publishNeed<T extends NeedParams, U extends MessageParams>(needParams: T): Promise<Need<T, U>> {
    const bidsChannelName = await this.registerNewTopic(); // Channel#3
    needParams.id = bidsChannelName;
    needParams.davId = this.davId;
    try {
      await axios.post(`${this._config.apiSeedUrls[0]}/publishNeed/${bidsChannelName}`, needParams.serialize());
    } catch (err) {
      throw new Error(`Fail to publish need: ${err}`);
    }
    return new Need<T, U>(bidsChannelName, needParams, this._config);
  }

  /**
   * @method needsForType Used to subscribe for specific needs (filtered by params).
   * @param params the filter parameters.
   * @param needParamsType The expected need params object type.
   * @returns Observable for needs subscription.
   */
  public async needsForType<T extends NeedParams, U extends MessageParams>(needFilterParams: NeedFilterParams,
    needParamsType: new (...all: any[]) => T): Promise<Observable<Need<T, U>>> {
    const formatedParams = needFilterParams.serialize();
    let needTypeTopic = '';
    if (this.topics[formatedParams.protocol]) {
      needTypeTopic = this.topics[formatedParams.protocol];
    } else {
      needTypeTopic = await this.registerNewTopic();
      this.topics[formatedParams.protocol] = needTypeTopic;
      try {
        await axios.post(`${this._config.apiSeedUrls[0]}/needsForType/${needTypeTopic}`, formatedParams);
      } catch (err) {
        throw new Error(`Needs registration failed: ${err}`);
      }
    }
    const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(needTypeTopic, this._config); // Channel#2
    const needParamsStream: Observable<T> = kafkaMessageStream.filterType(needParamsType);
    const observable = Observable.fromObservable(needParamsStream.map((needParams: T) =>
      new Need<T, U>(needTypeTopic, needParams, this._config)), needParamsStream.topic);
    return observable;
  }
  /**
   * @method missions Used to subscribe for missions.
   * @param missionParamsType The expected mission param object type.
   * @param channelId Specify channelId only to get an observable for existed subscription.
   * @returns Observable for missions subscription.
   */
  public async missions<T extends MissionParams, U extends MessageParams>(missionParamsType: new (...all: any[]) => T,
    channelId?: ID): Promise<Observable<Mission<T>>> {
    throw new Error('Not implemented in this version');
  }
  /**
   * @method messages Used to subscribe for messages.
   * @param messageParamsType The expected mission param object type.
   * @param channelId Specify channelId only to get an observable for existed subscription.
   * @returns Observable for messages subscription.
   */
  public async messages<T extends MessageParams>(messageParamsType: new (...all: any[]) => T, channelId?: ID): Promise<Observable<Message<T>>> {
    const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(this.id, this._config); // Channel#1
    const messageParamsStream: Observable<T> = kafkaMessageStream.filterType(messageParamsType);
    const messageStream = messageParamsStream.map((params: T) =>
      new Message<T>(this.id, params, this._config));
    return Observable.fromObservable(messageStream, messageParamsStream.topic);
  }
  /**
   * @method need Used to restore an existed need.
   * @param params The need parameters.
   * @returns The restored need.
   */
  public need<T extends NeedParams, U extends MessageParams>(params: T): Need<T, U> {
    const selfId = params.id;
    return new Need(selfId, params, this._config);
  }
  /**
   * @method bid Used to restore an existed bid.
   * @param bidSelfId The selfId that used to create the bid.
   * @param params The bid parameters.
   * @returns The restored bid.
   */
  public bid<T extends BidParams, U extends MessageParams>(bidSelfId: ID, params: T): Bid<T, U> {
    return new Bid(bidSelfId, params, this._config);
  }
  /**
   * @method mission Used to restore an existed mission.
   * @param params The mission parameters.
   * @returns The restored mission.
   */
  public mission<T extends MissionParams, U extends MessageParams>(missionSelfId: ID, params: T): Mission<T> {
    return new Mission(missionSelfId, params, this._config);
  }
}
