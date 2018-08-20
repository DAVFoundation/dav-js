import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class ride-hailing/NeedFilterParams represent the parameters that used to filter ride-hailing needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {

    private static _protocol = 'RideHailing';
    private static _type = 'NeedFilter';

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static fromJson(json: any): NeedFilterParams {
        return new NeedFilterParams(json);
    }

    constructor(values: Partial<NeedFilterParams>) {
        if (!values.area || !values.area.lat || !values.area.long || !values.area.radius) {
            throw new Error('NeedFilter lack of essential parameters');
        }
        super(values);
   }

    public toJson(): string {
        const bidParams = Object.assign({ protocol: NeedFilterParams._protocol, type: NeedFilterParams._type }, this);
        return JSON.stringify(bidParams);
    }

    public toString(): string { return ''; }
}
