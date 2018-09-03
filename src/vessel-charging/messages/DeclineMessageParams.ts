import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging decline mission message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type = 'decline_message';

    public static getMessageType(): string {
        return MessageParams._type;
    }

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._type, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
