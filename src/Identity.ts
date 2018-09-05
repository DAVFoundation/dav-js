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
   * @param needParams the need parameters.
   * @returns the created need.
   */
  public async publishNeed<T extends NeedParams>(needParams: T): Promise<Need<T>> {
    const bidsChannelName = await this.registerNewTopic(); // Channel#3
    needParams.id = bidsChannelName;
    needParams.davId = this.davId || needParams.davId;
    try {
      await axios.post(`${this._config.apiSeedUrls[0]}/publishNeed/${bidsChannelName}`, needParams.serialize());
    } catch (err) {
      throw new Error(`Fail to publish need: ${err}`);
    }
    return new Need<T>(bidsChannelName, needParams, this._config);
  }

  /**
   * @method needsForType Used to subscribe for specific needs (filtered by params).
   * @param needFilterParams the filter parameters.
   * @returns Observable for needs subscription.
   */
  public async needsForType<T extends NeedParams>(needFilterParams: NeedFilterParams): Promise<Observable<Need<T>>> {
    const formattedParams = needFilterParams.serialize();
    let needTypeTopic = '';
    if (this.topics[formattedParams.protocol]) {
      needTypeTopic = this.topics[formattedParams.protocol];
    } else {
      needTypeTopic = await this.registerNewTopic();
      this.topics[formattedParams.protocol] = needTypeTopic;
      try {
        await axios.post(`${this._config.apiSeedUrls[0]}/needsForType/${needTypeTopic}`, formattedParams);
      } catch (err) {
        throw new Error(`Needs registration failed: ${err}`);
      }
    }
    const kafkaMessageStream: KafkaMessageStream = await Kafka.messages(needTypeTopic, this._config); // Channel#2
    const protocolTypesMap = needFilterParams.getProtocolTypes();
    const needParamsStream: Observable<T> = kafkaMessageStream.filterType(protocolTypesMap, protocolTypesMap.needs);
    const observable = Observable.fromObservable(needParamsStream.map((needParams: T) =>
      new Need<T>(needTypeTopic, needParams, this._config)), needParamsStream.topic);
    return observable;
  }
  /**
   * @method missions Used to subscribe for missions.
   * @returns Observable for missions subscription.
   */
  public async missions<T extends MissionParams, U extends MessageParams>(): Promise<Observable<Mission<T>>> {
    throw new Error('Not implemented in this version');
  }
  /**
   * @method messages Used to subscribe for messages.
   * @returns Observable for messages subscription.
   */
  public async messages<T extends MessageParams>(): Promise<Observable<Message<T>>> {
    throw new Error('Not implemented in this version');
  }
  /**
   * @method need Used to restore an existed need.
   * @param needSelfId The selfId that used to create the bid.
   * @param params The need parameters.
   * @returns The restored need.
   */
  public need<T extends NeedParams, U extends MessageParams>(needSelfId: ID, params: T): Need<T> {
    return new Need(needSelfId, params, this._config);
  }
  /**
   * @method bid Used to restore an existed bid.
   * @param bidSelfId The selfId that used to create the bid.
   * @param params The bid parameters.
   * @returns The restored bid.
   */
  public bid<T extends BidParams, U extends MessageParams>(bidSelfId: ID, params: T): Bid<T> {
    return new Bid(bidSelfId, params, this._config);
  }
  /**
   * @method mission Used to restore an existed mission.
   * @param missionSelfId The mission self topic ID.
   * @param missionPeerId The mission peer topic ID.
   * @param params The mission parameters.
   * @returns The restored mission.
   */
  public mission<T extends MissionParams, U extends MessageParams>(missionSelfId: ID, missionPeerId: ID, params: T): Mission<T> {
    return new Mission(missionSelfId, missionPeerId, params, this._config);
  }
}
