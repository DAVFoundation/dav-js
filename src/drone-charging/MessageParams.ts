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

    public static deserialize(json: any) {
        const messageParams = super.deserialize(json);
        Object.assign(messageParams, {
        });
        return messageParams;
    }

    constructor(values: Partial<MessageParams>) {
        super(values, MessageParams._protocol, MessageParams._type);
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            protocol: MessageParams._protocol,
            type: MessageParams._type,
        });
        return formatedParams;
    }
}
