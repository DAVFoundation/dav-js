import IConfig from './IConfig';
import { ID } from './common-types';
import { MessageStatus, MessageDomain } from './common-enums';
import Bid from './Bid';
import BidParams from './BidParams';
import Mission from './Mission';

export default class Message<T extends BidParams> {

    constructor(
      public selfId: ID,
      public peerId: ID,
      public bid: Bid<T>,
      public mission: Mission,
      public status: MessageStatus,
      public domain: MessageDomain,
      private config: IConfig) {
        /** */
    }

    public async respond(type: string, payload: any) {
        return false;
    }
}
