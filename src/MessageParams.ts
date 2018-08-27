import BasicParams from './BasicParams';
import { ID, BigInteger } from './common-types';

export interface IMessageParams {
    /**
     * @property The message sender id.
     */
    senderId: ID | BigInteger;
}

/**
 * @class The abstract Class MessageParams represent common parameters of MessageParams classes.
 */
export default abstract class MessageParams extends BasicParams {
    /**
     * @property The message sender id.
     */
    public senderId: ID | BigInteger;

    public static deserialize(json: any) {
        const messageParams = {
            senderId: json.senderId,
            ttl: json.ttl,
        };
        return messageParams as MessageParams;
    }

    constructor(values: Partial<MessageParams>, protocol: string, type: string) {
        super(values, protocol, type);
        this.senderId = values.senderId;
    }

    public serialize() {
        const formatedParams: any = {
            senderId: this.senderId,
            ttl: this.ttl,
        };
        return formatedParams;
    }

}
