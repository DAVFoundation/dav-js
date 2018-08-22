import BaseMessageParams from '../MessageParams';

/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _protocol = 'boat_charging';
    private static _type = 'message';
    public static getMessageType(): string {
        return 'boat_charging:message';
    }

    public static fromJson(json: any): MessageParams {
        return new MessageParams(json);
    }

    constructor(values: Partial<MessageParams>) { super(values); }

    public toJson() {
        const needParams = Object.assign({ protocol: MessageParams._protocol, type: MessageParams._type }, this);
        return JSON.stringify(needParams);
    }
}
