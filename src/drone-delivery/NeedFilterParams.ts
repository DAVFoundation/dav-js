import BaseNeedFilterParams from '../NeedFilterParams';

export default class NeedFilterParams extends BaseNeedFilterParams {
    public static getMessageType(): string {
        return 'DroneDelivery:NeedFilter';
    }

    public static fromJson(json: any): NeedFilterParams {
        return new NeedFilterParams(json);
    }

    constructor(values: Partial<NeedFilterParams>) {
         super(values);
    }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
