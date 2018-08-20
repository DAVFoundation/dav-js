import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class drone-delivery/NeedFilterParams represent the parameters that used to filter drone-delivery needs.
 */
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
