import { Observable, DavID, ID } from './common-types';
import IConfig from './IConfig';
import NeedParams from './NeedParams';
import NeedFilterParams from './NeedFilterParams';
import Need from './Need';
import Bid from './Bid';
import Message from './Message';
import Mission from './Mission';
import BidParams from './BidParams';


export default class Identity {
  private _messages: Observable<Message>;

  constructor(public id: ID, public davID: DavID, private config: IConfig) { /**/ }

  public async needsForType<T extends NeedFilterParams, U extends NeedParams>(params: T): Promise<Observable<Need<U>>> {
    return Promise.resolve(new Observable<Need<U>>()); }

  public need<T extends NeedParams>(id: ID, params: T): Need<T> { return new Need(id, '', params, this.config); }
  public bid<T extends BidParams>(id: ID, params: T): Bid<T> { return new Bid(id, '', params, this.config); }
  public mission(selfId: ID, peerId: ID): Mission { return new Mission(selfId, peerId, new Identity('id', 'davId', this.config), this.config); }
  public messages(): Observable<Message> {
    if (!this._messages) {
      this._messages = new Observable<Message>();
    }
    return this._messages;
  }
  public async publishNeed<T extends NeedParams>(params: T): Promise<Need<T>> { return Promise.resolve(new Need('', '', params, this.config)); }
}
