import { Observable, DavID, ID } from './common';
import IConfig from './IConfig';
import NeedParams from './NeedParams';
import NeedFilterParams from './NeedFilterParams';
import Need from './Need';
import Bid from './Bid';
import Message from './Message';
import Mission from './Mission';
import BidParams from './drone-charging/BidParams';


export default class Identity {
  private _messages: Observable<Message>;

  constructor(public id: ID, public davID: DavID, private config: IConfig) { /**/ }

  public async needsForType(params: NeedFilterParams): Promise<Observable<Need>> { return Promise.resolve(new Observable<Need>()); }
  public need(id: ID, params: NeedParams): Need { return new Need(id, '', params, this.config); }
  public bid<T extends BidParams>(id: ID, params: T): Bid<T> { return new Bid(id, '', params, this.config); }
  public mission(selfId: ID, peerId: ID): Mission { return new Mission(selfId, peerId, this.config); }
  public messages(): Observable<Message> {
    if (!this._messages) {
      this._messages = new Observable<Message>();
    }
    return this._messages;
  }
  public async publishNeed(params: NeedParams): Promise<Need> { return Promise.resolve(new Need('', '', params, this.config)); }
}
