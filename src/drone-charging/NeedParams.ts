import BaseNeedParams from '../NeedParams';

/**
 * @class The Class drone-charging/NeedParams represent the parameters of drone-charging need.
 */
export default class NeedParams extends BaseNeedParams {
    public static getMessageType(): string {
        return 'DroneCharging:Need';
    }

    public static fromJson(json: any): NeedParams {
        const needParams = new NeedParams(json);
        Object.assign(needParams, json);
        return needParams;
    }

    constructor(values: Partial<BaseNeedParams>) {
        super(values);
    }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
