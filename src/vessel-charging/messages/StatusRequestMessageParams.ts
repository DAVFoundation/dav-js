import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/StatusRequestMessageParams represent the parameters of boat-charging status request message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type = 'status_request_message';

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
