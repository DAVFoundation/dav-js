import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging provider status message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type = 'provider_status_message';
    public finishEta: number;

    public static getMessageType(): string {
        return MessageParams._type;
    }

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._type, values);
        if (!!values) {
            if (!values.finishEta) {
                throw new Error('finishEta is a required field');
            }
            this.finishEta = values.finishEta;
        }
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            finishEta: this.finishEta,
        });
        return formatedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.finishEta = json.finishEta;
    }
}
