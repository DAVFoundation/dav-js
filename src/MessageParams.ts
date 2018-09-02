import BasicParams from './BasicParams';
import { ID, BigInteger } from './common-types';

export interface IMessageParams {
    /**
     * @property The message sender id.
     */
    senderId: ID | BigInteger;
}

/**
 * @class The Class MessageParams represent common parameters of MessageParams classes.
 */
export default class MessageParams extends BasicParams {
    /**
     * @property The message sender id.
     */
    public senderId: ID | BigInteger;

    public static getMessageType(): string {
        return 'general:message';
    }

    public static deserialize(json: any) {
        const messageParams = super.deserialize(json);
        Object.assign(messageParams, {senderId: json.senderId});
        return messageParams as MessageParams;
    }

    constructor(values: Partial<MessageParams>, protocol?: string, type?: string) {
        super(values, protocol, type);
        this.senderId = values.senderId;
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {senderId: this.senderId});
        return formattedParams;
    }

}
