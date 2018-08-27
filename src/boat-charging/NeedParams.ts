import BaseNeedParams from '../NeedParams';

/**
 * @class The Class boat-charging/NeedParams represent the parameters of boat-charging need.
 */
export default class NeedParams extends BaseNeedParams {
    private static _protocol = 'boat_charging';
    private static _type = 'need';

    public static getMessageType(): string {
        return `${NeedParams._protocol}:${NeedParams._type}`;
    }

    public static deserialize(json: any) {
        const needParams = super.deserialize(json);
        Object.assign(needParams, {
        });
        return needParams;
    }

    constructor(values: Partial<NeedParams>) {
        super(values, NeedParams._protocol, NeedParams._type);
        Object.assign(this, values);
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
