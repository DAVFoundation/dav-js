import BaseMessageParams from '../MessageParams';
/**
 * @class The Class vessel-charging/StartingMessageParams represent the parameters of vessel-charging approve mission by the service provider message.
 */
export default class MessageParams extends BaseMessageParams {
    public static _messageType = 'starting_message';

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
