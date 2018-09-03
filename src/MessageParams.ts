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

    constructor(protocol: string, type: string, values?: Partial<MessageParams>) {
        super(protocol, type, values);
        if (!!values) {
            this.senderId = values.senderId;
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {senderId: this.senderId});
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.senderId = json.senderId;
    }
}
