import BasicParams from './BasicParams';
import { ID, BigInteger } from './common-types';
import { MessageStatus, MessageDomain } from './common-enums';

export default abstract class MessageParams extends BasicParams {
    public senderId: ID | BigInteger;
    public status: MessageStatus;
    public domain: MessageDomain;
    constructor(values: Partial<MessageParams>) {
        super();
        Object.assign(this, values);
    }
}
