import BasicParams from './BasicParams';
import { ID, BigInteger } from './common-types';
import { MessageStatus, MessageDomain } from './common-enums';

/**
 * @class The abstract Class MessageParams represent common parameters to all the SDK's MessageParams classes.
 */
export default abstract class MessageParams extends BasicParams {
    public senderId: ID | BigInteger;
    public status: MessageStatus;
    public domain: MessageDomain;
    constructor(values: Partial<MessageParams>) {
        super();
        Object.assign(this, values);
    }
}
