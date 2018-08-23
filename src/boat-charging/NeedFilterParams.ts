import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class boat-charging/NeedFilterParams represent the parameters that used to filter boat-charging needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol = 'boat_charging';
    private static _type = 'need';
    public static getMessageType(): string {
        return 'boat_charging:need';
    }

    public static fromJson(json: any): NeedFilterParams {
        return new NeedFilterParams(json);
    }

    constructor(values: Partial<NeedFilterParams>) {
        super(values, NeedFilterParams._protocol, NeedFilterParams._type);
    }

    public toJson() {
        const needParams = Object.assign({ protocol: NeedFilterParams._protocol, type: NeedFilterParams._type }, this);
        return JSON.stringify(needParams);
    }

    public toString(): string { return ''; }
}
