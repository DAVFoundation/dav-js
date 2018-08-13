import IConfig from './IConfig';
import { ID } from './common-types';
import MessageParams from './MessageParams';
import Kafka from './Kafka';

export default class Message<T extends MessageParams> {

    constructor(
      public selfId: ID,
      public messageParams: MessageParams,
      private config: IConfig) {
        /* */
    }

    public async respond(params: MessageParams) {
        params.senderId = this.selfId;
        return Kafka.sendParams(this.messageParams.senderId, params, this.config);
    }
}
