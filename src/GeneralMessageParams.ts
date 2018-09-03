import BaseMessageParams from './MessageParams';

/**
 * @class The Class MessageParams represent common parameters of MessageParams classes.
 */
export default class GeneralMessageParams extends BaseMessageParams {

    private static _protocol = 'general';
    private static _type = 'message';

    public static getMessageType(): string {
        return GeneralMessageParams._type;
    }

    public static getMessageProtocol(): string {
        return GeneralMessageParams._protocol;
    }

    constructor(values?: Partial<GeneralMessageParams>) {
        super(GeneralMessageParams._protocol, GeneralMessageParams._type, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public getProtocolTypes() {
        throw new Error('there is no protocol for general messages');
    }

    public  deserialize(json: any): void {
        super.deserialize(json);
    }
}
