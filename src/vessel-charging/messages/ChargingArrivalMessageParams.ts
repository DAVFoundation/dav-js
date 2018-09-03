import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/ChargingArrivalMessageParams represent the parameters of boat-charging arrival message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type = 'charging_arrival_message';

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
