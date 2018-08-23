import BaseMissionParams from '../MissionParams';
import IMissionParams from '../IMissionParams';

/**
 * @class The Class drone-charging/MissionParams represent the parameters of drone-charging mission.
 */
export default class MissionParams extends BaseMissionParams {

    private static _protocol = 'drone_charging';
    private static _type = 'Mission';

    public static getMessageType(): string {
        return `${MissionParams._protocol}${MissionParams._type}`;
    }

    public static fromJson(json: any): MissionParams {
        return new MissionParams(json);
    }

    constructor(values: Partial<IMissionParams>) {
        super(values, MissionParams._protocol, MissionParams._type);
    }
}
