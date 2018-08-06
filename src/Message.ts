import IConfig from './IConfig';
import { ID } from './common-types';
import Bid from './Bid';
import BidParams from './BidParams';
import Mission from './Mission';
import MessageParams from './MessageParams';
import Kafka from './Kafka';

export default class Message<T extends MessageParams, U extends BidParams> {

    constructor(
      public selfId: ID,
      public bid: Bid<U, T>,
      public mission: Mission<T, U>,
      public messageParams: MessageParams,
      private config: IConfig) {
        /* */
    }

    public async respond(params: MessageParams) {
        params.senderId = this.selfId;
        return Kafka.sendParams(this.messageParams.senderId, params, this.config);
    }
}
