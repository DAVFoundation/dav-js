import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class boat-charging/NeedFilterParams represent the parameters that used to filter boat-charging needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    public static getMessageType(): string {
        return 'Boat:NeedFilter';
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

    public toString(): string { return ''; }
}
