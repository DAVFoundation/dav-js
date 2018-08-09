import BaseMissionParams from '../MissionParams';
import { ID, DavID, BigInteger } from '../common-types';
import IPrice from '../IPrice';

export default class MissionParams extends BaseMissionParams {

    constructor(public id: ID, public neederDavId: DavID, public vehicleId: DavID, price: IPrice | BigInteger) {
        super(id, neederDavId, vehicleId, price);
    }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }

    public toString(): string { return ''; }
}
