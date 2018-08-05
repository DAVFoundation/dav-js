import BasicParams from './BasicParams';
import { ID } from './common-types';
import { MessageStatus, MessageDomain } from './common-enums';

const defaultValues = {
};

export default abstract class MessageParams extends BasicParams {
    public status: MessageStatus;
    public domain: MessageDomain;
    constructor(values: Partial<MessageParams>) {
        super();
        Object.assign(this, defaultValues, values);
    }
}
