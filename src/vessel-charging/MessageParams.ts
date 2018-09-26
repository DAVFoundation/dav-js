import BaseMessageParams from '../MessageParams';

/**
 * @class The Class vessel-charging/MessageParams represent the parameters of vessel-charging message.
 */
export default abstract class MessageParams extends BaseMessageParams {
    public static _protocol = 'vessel_charging';

    constructor(messageType: string, values?: Partial<MessageParams>) {
        super(MessageParams._protocol, messageType, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
