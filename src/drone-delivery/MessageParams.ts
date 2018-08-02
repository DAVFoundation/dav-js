import BaseMessageParams from '../MessageParams';

export default class MessageParams extends BaseMessageParams {

    constructor(values: Partial<MessageParams>) { super(values); }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
