import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/ChargingCompleteMessageParams represent the parameters of boat-charging complete charging message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type = 'charging_complete_message';

    public static getMessageType(): string {
        return MessageParams._type;
    }

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._type, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
