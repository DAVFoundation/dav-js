import BasicParams from './BasicParams';
import { ID } from './common-types';
import { MessageStatus, MessageDomain } from './common-enums';

export default abstract class MessageParams extends BasicParams {
    public senderId: ID;
    public status: MessageStatus;
    public domain: MessageDomain;
    constructor(values: Partial<MessageParams>) {
        super(/* values */);
    }
}
