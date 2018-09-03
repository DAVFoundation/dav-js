import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/ChargingStartedMessageParams represent the parameters of provider notifying that charging has begun.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type = 'charging_started_message';

    public static getMessageType(): string {
        return MessageParams._type;
    }

    public static deserialize(json: any): MessageParams {
        const messageParams = super.deserialize(json);
        return new MessageParams(messageParams);
    }

    constructor(values: Partial<MessageParams>) {
        super(values, MessageParams._type);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }
}
