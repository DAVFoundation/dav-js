import BaseMissionParams from '../MissionParams';
import IBaseMissionParams from '../IMissionParams';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class ride-hailing/MissionParams represent the parameters of ride-hailing mission.
 */
export default class MissionParams extends BaseMissionParams {

    private static _protocol = 'ride_hailing';
    private static _type = 'mission';

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static deserialize(json: any): MissionParams {
        const missionParams = super.deserialize(json);
        return new MissionParams(missionParams);
    }

    constructor(values: Partial<IBaseMissionParams>) {
        super(values, MissionParams._protocol, MissionParams._type);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
