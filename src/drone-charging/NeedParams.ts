import BaseNeedParams from '../NeedParams';

/**
 * @class The Class drone-charging/NeedParams represent the parameters of drone-charging need.
 */
export default class NeedParams extends BaseNeedParams {

    private static _protocol = 'drone_charging';
    private static _type = 'Need';

    public static getMessageType(): string {
        return `${NeedParams._protocol}:${NeedParams._type}`;
    }

    constructor(values?: Partial<BaseNeedParams>) {
        super(NeedParams._protocol, NeedParams._type, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
