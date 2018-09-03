import BaseMissionParams from '../MissionParams';
import IMissionParams from '../IMissionParams';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class drone-charging/MissionParams represent the parameters of drone-charging mission.
 */
export default class MissionParams extends BaseMissionParams {

    private static _protocol = 'drone_charging';
    private static _type = 'Mission';

    public static deserialize(json: any): MissionParams {
        const missionParams = super.deserialize(json);
        return new MissionParams(missionParams);
    }

    constructor(values: Partial<IMissionParams>) {
        super(values, MissionParams._protocol, MissionParams._type);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
