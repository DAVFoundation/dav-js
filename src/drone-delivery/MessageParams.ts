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

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._protocol, MessageParams._type, values);
    }

    public serialize() {
        return super.serialize();
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
