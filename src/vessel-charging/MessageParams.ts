import BaseMessageParams from '../MessageParams';

/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging message.
 */
export default abstract class MessageParams extends BaseMessageParams {
    protected static _protocol = 'boat_charging';

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
