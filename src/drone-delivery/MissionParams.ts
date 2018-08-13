import BaseMissionParams from '../MissionParams';

export default class MissionParams extends BaseMissionParams {

    public static getMessageType(): string {
        return 'DroneCharging:Mission';
    }

    public static fromJson(json: any): MissionParams {
        // TODO?
        return null;
    }

    constructor(values: Partial<MissionParams> | any) {
        super(values);
    }

    public toJson(): string {
        // TODO?
        throw new Error('Method not implemented.');
    }

    public toString(): string { return ''; } // TODO?

}
