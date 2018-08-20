import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, DavID, BigInteger } from './common-types';
import Price from './Price';
import { PriceType } from './common-enums';
import IMissionParams from './IMissionParams';
import { callbackify } from 'util';

/**
 * @class The abstract Class MissionParams represent common parameters of MissionParams classes.
 */
export default abstract class MissionParams extends BasicParams {
    public price: IPrice;
    public id: ID;
    public neederDavId: DavID;
    public vehicleId: DavID;

    // TODO: think if it does make sense let the user give id, but override it anyway when bid is accepted
    constructor(values: Partial<IMissionParams>) {
        super(values);
        if (!values.id) {
            throw new Error ('id is a required field');
        }
        if (!values.neederDavId) {
            throw new Error ('neederDavId is a required field');
        }
        this.id = values.id;
        this.neederDavId = values.neederDavId;
    }
}
