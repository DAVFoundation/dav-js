import BaseMessageParams from '../MessageParams';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging message.
 */
export default abstract class MessageParams extends BaseMessageParams {
    protected static _protocol = 'boat_charging';

    public static deserialize(json: any): MessageParams {
        const messageParams = super.deserialize(json);
        return messageParams;
    }

    constructor(values: Partial<MessageParams>, messageType: string) {
        super(values, MessageParams._protocol, messageType);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
