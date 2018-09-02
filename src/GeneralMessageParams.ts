import BaseMessageParams from './MessageParams';

/**
 * @class The Class MessageParams represent common parameters of MessageParams classes.
 */
export default class MessageParams extends BaseMessageParams {

    private static _protocol = 'general';
    private static _type = 'message';

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static deserialize(json: any) {
        const messageParams = super.deserialize(json);
        Object.assign(messageParams, {senderId: json.senderId});
        return messageParams as MessageParams;
    }

    constructor(values: Partial<MessageParams>, protocol?: string, type?: string) {
        super(values, MessageParams._protocol, MessageParams._type);
        this.senderId = values.senderId;
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {senderId: this.senderId});
        return formattedParams;
    }

}
