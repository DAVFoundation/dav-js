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

  private _needTypeId: ID;
  // DON'T USE THIS VARIABLE DIRECTLY! ONLY VIA ITS GETTER!
  private _kafkaMessageStream: KafkaMessageStream;

  constructor(public id: ID, public davID: DavID, private _config: IConfig) { /**/ }

  // sadly, async cannot be used in normal getter
  private async getKafkaMessageStream(channelId: ID): Promise<KafkaMessageStream> {
    if (channelId !== this._needTypeId) {
      return await Kafka.messages(channelId, this._config);
    }
    if (!this._kafkaMessageStream) {
        this._kafkaMessageStream = await Kafka.messages(this._needTypeId, this._config);
    }
    return this._kafkaMessageStream;
  }

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
  public async publishNeed<T extends NeedParams, U extends MessageParams>(params: T): Promise<Need<T, U>> {
    const bidsChannelName = await this.registerNewTopic(); // Channel#3
    params.id = bidsChannelName;
    await axios.post(`${this._config.apiSeedUrls[0]}/publishNeed/:${bidsChannelName}`, params);
    return new Need<T, U>(bidsChannelName, params, this._config);
  }

  /**
   * @method needsForType Used to subscribe for specific needs (filtered by params).
   * @param params the filter parameters.
   * @param needParamsType The expected need params object type.
   * @param channelId Specify channelId only to get an observable for existed subscription.
   * @returns Observable for needs subscription.
   */
  public async needsForType<T extends NeedParams, U extends MessageParams>(needFilterParams: NeedFilterParams,
     needParamsType: new (...all: any[]) => T, channelId?: ID): Promise<Observable<Need<T, U>>> {
    // TODO: duplicated code, extract to private method
    needFilterParams.davId = this.davID;
    let identityChannelName = channelId || this._needTypeId;
    if (!identityChannelName) {
      identityChannelName = await this.registerNewTopic();
      this._needTypeId = identityChannelName;
      try {
        console.log(needFilterParams);
        console.log(`${this._config.apiSeedUrls[0]}/needsForType/${identityChannelName}`);
        await axios.post(`${this._config.apiSeedUrls[0]}/needsForType/${identityChannelName}`, needFilterParams);
      } catch (err) {
        throw new Error(`Needs registration failed: ${err}`);
      }
    }
    const kafkaMessageStream: KafkaMessageStream = await this.getKafkaMessageStream(identityChannelName);
    const needParamsStream: Observable<T> = kafkaMessageStream.filterType(needParamsType);
    const observable = Observable.fromObservable(needParamsStream.map((needParams: T) =>
        new Need<T, U>(identityChannelName, needParams, this._config)), needParamsStream.topic);
    return observable;
  }
  /**
   * @method missions Used to subscribe for missions.
   * @param missionParamsType The expected mission param object type.
   * @param channelId Specify channelId only to get an observable for existed subscription.
   * @returns Observable for missions subscription.
   */
  public async missions<T extends MissionParams, U extends MessageParams>(missionParamsType: new (...all: any[]) => T,
   channelId?: ID): Promise<Observable<Mission<T, U>>> {
    // TODO: duplicated code, extract to private method
    let identityChannelName = channelId || this._needTypeId;
    if (!identityChannelName) {
      identityChannelName = await this.registerNewTopic();
      this._needTypeId = identityChannelName;
    }
    const kafkaMessageStream: KafkaMessageStream = await this.getKafkaMessageStream(identityChannelName); // Channel#2
    const missionParamsStream = kafkaMessageStream.filterType(missionParamsType);
    const messageStream = missionParamsStream.map((params: T) => {
      return new Mission<T, U>(identityChannelName, params, this._config);
    });
    return Observable.fromObservable(messageStream, missionParamsStream.topic);
  }
  /**
   * @method messages Used to subscribe for messages.
   * @param messageParamsType The expected mission param object type.
   * @param channelId Specify channelId only to get an observable for existed subscription.
   * @returns Observable for messages subscription.
   */
  public async messages<T extends MessageParams>(messageParamsType: new (...all: any[]) => T, channelId?: ID): Promise<Observable<Message<T>>> {
    // TODO: duplicated code, extract to private method
    let identityChannelName = channelId || this._needTypeId;
    if (!identityChannelName) {
      identityChannelName = await this.registerNewTopic();
      this._needTypeId = identityChannelName;
    }
    const kafkaMessageStream: KafkaMessageStream = await this.getKafkaMessageStream(identityChannelName); // Channel#2
    const messageParamsStream: Observable<T> = kafkaMessageStream.filterType(messageParamsType);
    const messageStream = messageParamsStream.map((params: MessageParams) =>
        new Message<T>(identityChannelName, params, this._config));
    return Observable.fromObservable(messageStream, messageParamsStream.topic);
  }
  /**
   * @method need Used to restore an existed need.
   * @param params The need parameters.
   * @returns The restored need.
   */
  public need<T extends NeedParams, U extends MessageParams>(params: T): Need<T, U> {
    const selfId = this._needTypeId || params.id;
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
  public mission<T extends MissionParams, U extends MessageParams>(missionSelfId: ID, params: T): Mission<T, U> {
    return new Mission(missionSelfId, params, this._config);
  }
}
