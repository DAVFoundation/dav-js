import './common';
import NeedParams from './NeedParams';
import NeedFilterParams from './NeedFilterParams';
import Need from './Need';
// ToDo: import Bid from './Bid';
// ToDo: import Message from './Message';
// ToDo: import Mission from './Mission';

/* tslint:disable *//*ToDo: delete*/class Bid { constructor(params){}}
/*ToDo: delete*/class Message { constructor(params){}}
/*ToDo: delete*/class Mission { constructor(params){}}/* tslint:enable */

export default interface IIdentity {
    davId: ID;
    _messages: NeedParams;
    needsForType: (params: NeedFilterParams) => Rx.Observable<Need>;
    need: (needId: ID) => Need;
    bid: (bidId: ID) => Bid;
    mission: (missionId: ID) => Mission;
    messages: (needId: ID) => Rx.Observable<Message>;
    publishNeed: (needId: ID) => Need;

}
