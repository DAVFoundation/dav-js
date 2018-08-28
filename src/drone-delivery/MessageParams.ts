import BaseMessageParams from '../MessageParams';

/**
 * @class The Class drone-delivery/MessageParams represent the parameters of drone-delivery message.
 */
export default class MessageParams extends BaseMessageParams {

    private static _protocol = 'DroneDelivery';
    private static _type = 'Bid';

    public static getMessageType(): string {
        return `${MessageParams._protocol}:${MessageParams._type}`;
    }

    public static deserialize(json: any): MessageParams {
        const messageParams = super.deserialize(json);
        return new MessageParams(messageParams);
    }

    constructor(values: Partial<MessageParams>) {
        super(values, MessageParams._protocol, MessageParams._type);
    }

    public serialize() {
        return super.serialize();
    }
}
