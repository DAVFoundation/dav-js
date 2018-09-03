import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/StartingMessageParams represent the parameters of boat-charging approve mission by the service provider message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type = 'starting_message';

    public static getMessageType(): string {
        return `${MessageParams._protocol}:${MessageParams._type}`;
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
