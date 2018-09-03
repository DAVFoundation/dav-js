import BaseMessageParams from '../MessageParams';

/**
 * @class The Class drone-charging/MessageParams represent the parameters of drone-charging message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _protocol = 'drone_charging';
    private static _type = 'Message';

    public static getMessageType(): string {
        return `${MessageParams._protocol}:${MessageParams._type}`;
    }

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._protocol, MessageParams._type, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
