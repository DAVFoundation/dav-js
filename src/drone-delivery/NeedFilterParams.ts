import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class drone-delivery/NeedFilterParams represent the parameters that used to filter drone-delivery needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol = 'drone_delivery';
    public static getMessageType(): string {
        return 'DroneDelivery:NeedFilter';
    }

    public static fromJson(json: any): NeedFilterParams {
        return new NeedFilterParams(json);
    }

    constructor(values: Partial<NeedFilterParams>) {
         super(values);
    }

    public toJson() {
        const needFilterParams = Object.assign({ protocol: NeedFilterParams._protocol }, this);
        return JSON.stringify(needFilterParams);
    }

    public toString(): string { return ''; }
}
