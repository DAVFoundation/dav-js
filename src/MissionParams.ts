import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, DavID, BigInteger } from './common-types';
import Price from './Price';
import { PriceType } from './common-enums';

/**
 * @interface IMissionParams The interface IMissionParams represent a valid argument of MissionParams constructor.
 */
interface IMissionParams {
    /**
     * @property The mission's topic id (used to send messages to consumer).
     */
    id: ID;
    /**
     * @property The mission's price.
     */
    price: IPrice | BigInteger;
    /**
     * @property The mission's vehicle DAV Id.
     */
    vehicleId: DavID;
    /**
     * @property The consumer DavID.
     */
    neederDavId: DavID;
}
/**
 * @class The abstract Class MissionParams represent common parameters to all the SDK's MissionParams classes.
 */
export default abstract class MissionParams extends BasicParams {
    public price: IPrice;
    public id: ID;
    public neederDavId: DavID;
    public vehicleId: DavID;

    constructor(values: Partial<IMissionParams>) {
        super();
        if (!values.price) {
            throw new Error ('price is this a required field');
        }
        if (!values.vehicleId) {
            throw new Error ('vehicleId is this a required field');
        }
        Object.assign(this, values);
        const priceObject = values.price;
        if (typeof priceObject === 'string') {
            this.price = new Price(priceObject as BigInteger, PriceType.flat);
        } else {
            this.price = new Price(priceObject.value, priceObject.type, priceObject.description);
        }
    }
}
