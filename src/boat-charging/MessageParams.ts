import BaseMessageParams from '../MessageParams';

/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _protocol = 'boat_charging';
    private static _type = 'message';
    public static getMessageType(): string {
        return 'boat_charging:message';
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
