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

export default class Identity {

  private _needTypeId: ID;

  constructor(public id: ID, public davID: DavID, private config: IConfig) { /**/ }

  public async publishNeed<T extends NeedParams, U extends MessageParams>(params: T): Promise<Need<T, U>> {
    const bidsChannelName = Kafka.generateTopicId(); // Channel#3
    params.id = bidsChannelName;
    await Kafka.createTopic(bidsChannelName, this.config);
    await axios.post(`${this.config.apiSeedUrls[0]}/publishNeed/:${bidsChannelName}`, params);
    return new Need<T, U>(bidsChannelName, params, this.config);
  }

  public async needsForType<T extends NeedParams, U extends MessageParams>(params: NeedFilterParams, channelId?: ID):
  Promise<Observable<Need<T, U>>> {
    const needsChannelName = channelId || Kafka.generateTopicId(); // Channel#2
    this._needTypeId = needsChannelName;
    try {
      if (!channelId) {
        await Kafka.createTopic(needsChannelName, this.config);
        await axios.post(`${this.config.apiSeedUrls[0]}/needsForType/:${needsChannelName}`, params);
      }
    } catch (err) {
      throw new Error(`Needs registration failed: ${err}`);
    }
    const stream = await Kafka.paramsStream(needsChannelName, this.config);
    const observable = Observable.fromObservable(stream.map((needParams: T) =>
        new Need<T, U>(needsChannelName, needParams, this.config)), stream.topic);
    return observable;
  }

  public async missions<T extends MissionParams, U extends MessageParams>(): Promise<Observable<Mission<T, U>>> {
    if (!this._needTypeId) {
      throw new Error(`You must subscribe for needs first`);
    }
    const stream = await Kafka.paramsStream(this._needTypeId, this.config); // Channel#2
    const messageStream = stream.map(async (params: T) => {
      const missionChannelName = Kafka.generateTopicId(); // Channel#5
      await Kafka.createTopic(missionChannelName, this.config);
      return new Mission<T, U>(this._needTypeId, params, this.config);
    })
    .map((promise) => Observable.fromPromise(promise))
    .mergeAll();
    return Observable.fromObservable(messageStream, stream.topic);
  }

  public async messages<T extends MessageParams>(): Promise<Observable<Message<T>>> {
    const stream = await Kafka.paramsStream(this._needTypeId, this.config); // Channel#2
    const messageStream = stream.map((params: MessageParams) =>
        new Message<T>(this._needTypeId, params, this.config));
    return Observable.fromObservable(messageStream, stream.topic);
  }

  public need<T extends NeedParams, U extends MessageParams>(params: T): Need<T, U> {
    const selfId = this._needTypeId || params.id;
    return new Need(selfId, params, this.config);
  }

  public bid<T extends BidParams, U extends MessageParams>(bidSelfId: ID, params: T): Bid<T, U> {
    return new Bid(bidSelfId, params, this.config);
  }

  public mission<T extends MissionParams, U extends MessageParams>(missionSelfId: ID, params: T): Mission<T, U> {
    return new Mission(missionSelfId, params, this.config);
  }
}
