import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/ChargingCompleteMessageParams represent the parameters of boat-charging complete charging message.
 */
export default class MessageParams extends BaseMessageParams {
    public static _messageType = 'charging_complete_message';

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._messageType, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
