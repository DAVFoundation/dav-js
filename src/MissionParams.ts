import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, DavID, BigInteger } from './common-types';
import Price from './Price';
import { PriceType } from './common-enums';
import IMissionParams from './IMissionParams';

/**
 * @class The abstract Class MissionParams represent common parameters of MissionParams classes.
 */
export default abstract class MissionParams extends BasicParams {
    public price: IPrice;
    public id: ID;
    public neederDavId: DavID;
    public vehicleId: DavID;

    // TODO: think if it does make sense let the user give id, but override it anyway when bid is accepted
    constructor(values: Partial<IMissionParams>, protocol: string, type: string) {
        super(values, protocol, type);
        Object.assign(this, values);
        const priceObject = values.price;
        if (priceObject) {
            this.price = typeof priceObject === 'string' ?
            this.price = new Price(priceObject as BigInteger, PriceType.flat) :
            this.price = new Price(priceObject.value, priceObject.type, priceObject.description);
        }
    }
}
