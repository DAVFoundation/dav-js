import IConfig from './IConfig';
import { ID } from './common-types';
import { MessageStatus, MessageDomain } from './common-enums';
import Bid from './Bid';
import BidParams from './BidParams';
import Mission from './Mission';
import MessageParams from './MessageParams';

export default class Message<T extends MessageParams, U extends BidParams> {

    constructor(
      public selfId: ID,
      public peerId: ID,
      public bid: Bid<U, T>,
      public mission: Mission<T, U>,
      public messageParams: MessageParams,
      private config: IConfig) {
        /** */
    }

    public async respond(type: string, payload: any) {
        return false;
    }
}
