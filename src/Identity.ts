import { Observable, DavID, ID } from './common';
import IConfig from './IConfig';
import NeedParams from './NeedParams';
import NeedFilterParams from './NeedFilterParams';
import Need from './Need';
import Bid from './Bid';
import Message from './Message';
import Mission from './Mission';


export default class Identity {
  private _messages: Observable<Message>;

  constructor(public id: ID, public davID: DavID, private config: IConfig) { /**/ }

  public needsForType(params: NeedFilterParams): Observable<Need> { return new Observable<Need>(); }
  public need(id: ID): Need { return new Need('', '', this.config); }
  public bid(id: ID): Bid { return new Bid('', '', this.config); }
  public mission(selfId: ID, peerId: ID): Mission { return new Mission(selfId, peerId, this.config); }
  public messages(): Observable<Message> {
    if (!this._messages) {
      this._messages = new Observable<Message>();
    }
    return this._messages;
  }
  public publishNeed(params: NeedParams): Need { return new Need('', '', params, this.config); }
}
