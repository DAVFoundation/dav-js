import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/ChargingStartedMessageParams represent the parameters of provider notifying that charging has begun.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type = 'charging_started_message';

    public static getMessageType(): string {
        return `${MessageParams._protocol}:${MessageParams._type}`;
    }

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._type, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public deserialize(json: any): void {
        const messageParams = super.deserialize(json);
    }
}
