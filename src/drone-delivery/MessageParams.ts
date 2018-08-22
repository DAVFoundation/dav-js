import { MessageParams as BaseMessageParams } from '../MessageParams';

/**
 * @class The Class drone-delivery/MessageParams represent the parameters of drone-delivery message.
 */
export default class MessageParams extends BaseMessageParams {
    public static getMessageType(): string {
        return 'DroneDelivery:Message';
    }

    public static fromJson(json: any): MessageParams {
        return new MessageParams(json);
    }

    constructor(values: Partial<MessageParams>) { super(values); }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
