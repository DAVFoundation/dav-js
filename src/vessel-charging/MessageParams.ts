import BaseMessageParams from '../MessageParams';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging message.
 */
export default abstract class MessageParams extends BaseMessageParams {
    protected static _protocol = 'boat_charging';

    public static getMessageProtocol(): string {
        return MessageParams._protocol;
    }

    constructor(messageType: string, values?: Partial<MessageParams>) {
        super(MessageParams._protocol, messageType, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
