import BaseNeedFilterParams from '../NeedFilterParams';

export default class NeedFilterParams extends BaseNeedFilterParams {
    public static getMessageType(): string {
        return 'DroneCharging:NeedFilter';
    }

    public static fromJson(json: any): NeedFilterParams {
        return new NeedFilterParams(json);
    }

    constructor(values: Partial<NeedFilterParams>) { super(); }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }

    public toString(): string { return ''; }
}
