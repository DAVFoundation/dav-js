import BaseNeedParams from '../NeedParams';

/**
 * @class The Class boat-charging/NeedParams represent the parameters of boat-charging need.
 */
export default class NeedParams extends BaseNeedParams {
    public static getMessageType(): string {
        return 'BoatCharging:Need';
    }

    public static fromJson(json: any): NeedParams {
        const needParams = new NeedParams({});
        Object.assign(needParams, json);
        return needParams;
    }

    constructor(values: Partial<NeedParams>) {
        super();
        Object.assign(this, values);
    }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
