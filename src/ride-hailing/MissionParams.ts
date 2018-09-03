import BaseMissionParams from '../MissionParams';
import IBaseMissionParams from '../IMissionParams';

/**
 * @class The Class ride-hailing/MissionParams represent the parameters of ride-hailing mission.
 */
export default class MissionParams extends BaseMissionParams {

    private static _protocol = 'ride_hailing';
    private static _type = 'mission';

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    constructor(values?: Partial<IBaseMissionParams>) {
        super(MissionParams._protocol, MissionParams._type, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
