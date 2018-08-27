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

    public static deserialize(json: any) {
        const needParams = super.deserialize(json);
        Object.assign(needParams, {
        });
        return new NeedParams(needParams);
    }

    constructor(values: Partial<BaseNeedParams>) {
        super(values, NeedParams._protocol, NeedParams._type);
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            protocol: NeedParams._protocol,
            type: NeedParams._type,
        });
        return formatedParams;
    }

}
