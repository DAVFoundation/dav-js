import BaseMissionParams from '../MissionParams';
import IBaseMissionParams from '../IMissionParams';

/**
 * @class The Class ride-hailing/MissionParams represent the parameters of ride-hailing mission.
 */
export default class MissionParams extends BaseMissionParams {

    private static _protocol = 'RideHailing';
    private static _type = 'Mission';

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static fromJson(json: any): MissionParams {
        // TODO?
        return null;
    }

    constructor(values: Partial<IBaseMissionParams>) {
        super(values);
    }

    public toJson(): string {
        // TODO?
        throw new Error('Method not implemented.');
    }

    public toString(): string { return ''; } // TODO?

}
