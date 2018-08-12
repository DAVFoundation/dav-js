import BaseMissionParams from '../MissionParams';
import { ID, DavID, BigInteger } from '../common-types';
import IPrice from '../IPrice';

export default class MissionParams extends BaseMissionParams {
    public static getMessageType(): string {
        return 'DroneCharging:Mission';
    }

    public static fromJson(json: any): MissionParams {
        // return new MissionParams(json);
        return null;
    }

    constructor(public id: ID, public neederDavId: DavID, public vehicleId: DavID, price: IPrice | BigInteger) {
        super(id, neederDavId, vehicleId, price);
    }

    // constructor(values: Partial<MissionParams>) { super(values); }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }

    public toString(): string { return ''; }
}
