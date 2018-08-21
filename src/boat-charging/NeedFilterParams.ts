import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class boat-charging/NeedFilterParams represent the parameters that used to filter boat-charging needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol = 'boat_charging';
    public static getMessageType(): string {
        return 'Boat:NeedFilter';
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
