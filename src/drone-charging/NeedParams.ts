import BaseNeedParams from '../NeedParams';

export default class NeedParams extends BaseNeedParams {
    public static getMessageType(): string {
        return 'DroneCharging:Need';
    }

    public static fromJson(json: any): NeedParams {
        const needParams = new NeedParams();
        Object.assign(needParams, json);
        return needParams;
    }

    constructor() {
        super();
    }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
