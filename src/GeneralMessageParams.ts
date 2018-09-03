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

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._protocol, MessageParams._type, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public  deserialize(json: any): void {
        super.deserialize(json);
    }
}
