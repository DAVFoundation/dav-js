import BaseMessageParams from '../MessageParams';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class drone-delivery/MessageParams represent the parameters of drone-delivery message.
 */
export default class MessageParams extends BaseMessageParams {

    private static _protocol = 'drone_delivery';
    private static _type = 'message';

    public static getMessageType(): string {
        return MessageParams._type;
    }

    public static getMessageProtocol(): string {
        return MessageParams._protocol;
    }

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._protocol, MessageParams._type, values);
    }

    public serialize() {
        return super.serialize();
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
