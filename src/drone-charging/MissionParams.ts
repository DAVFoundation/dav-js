import BaseMissionParams from '../MissionParams';
import IMissionParams from '../IMissionParams';

/**
 * @class The Class drone-charging/MissionParams represent the parameters of drone-charging mission.
 */
export default class MissionParams extends BaseMissionParams {

    private static _protocol = 'drone_charging';
    private static _type = 'Mission';

    public static deserialize(json: any) {
        const missionParams = super.deserialize(json);
        Object.assign(missionParams, {
        });
        return new MissionParams(missionParams);
    }

    constructor(values: Partial<IMissionParams>) {
        super(values, MissionParams._protocol, MissionParams._type);
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            protocol: MissionParams._protocol,
            type: MissionParams._type,
        });
        return formatedParams;
    }
}
