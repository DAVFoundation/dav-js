import BasicParams from './BasicParams';
import { ID, BigInteger } from './common-types';
import { MessageStatus, MessageDomain } from './common-enums';

/**
 * @class The abstract Class MessageParams represent common parameters of MessageParams classes.
 */
export default abstract class MessageParams extends BasicParams {
    /**
     * @property The message sender id.
     */
    public senderId: ID | BigInteger;
    /**
     * @property The message status, accepted/contractSigned/etc...
     */
    public status: MessageStatus;
    /**
     * @property The message domain, bid/mission/etc...
     */
    public domain: MessageDomain;
    constructor(values: Partial<MessageParams>) {
        super();
        Object.assign(this, values);
    }
}
