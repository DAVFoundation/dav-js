import BaseMessageParams from './MessageParams';

/**
 * @class The Class MessageParams represent common parameters of MessageParams classes.
 */
export default class GeneralMessageParams extends BaseMessageParams {

    private static _protocol = 'general';
    private static _type = 'message';

    public static getMessageType(): string {
        return GeneralMessageParams._protocol;
    }

    public static getMessageProtocol(): string {
        return GeneralMessageParams._type;
    }

    public static deserialize(json: any) {
        const messageParams = super.deserialize(json);
        Object.assign(messageParams, {senderId: json.senderId});
        return messageParams as GeneralMessageParams;
    }

    constructor(values: Partial<GeneralMessageParams>, protocol?: string, type?: string) {
        super(values, GeneralMessageParams._protocol, GeneralMessageParams._type);
        this.senderId = values.senderId;
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {senderId: this.senderId});
        return formattedParams;
    }

    public getProtocolTypes() {
        throw new Error('there is no protocol for general messages');
    }

}
