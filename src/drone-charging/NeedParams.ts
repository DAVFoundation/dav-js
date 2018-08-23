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

    public static fromJson(json: any): NeedParams {
        return new NeedParams(json);
    }

    constructor(values: Partial<BaseNeedParams>) {
        super(values, NeedParams._protocol, NeedParams._type);
    }
}
