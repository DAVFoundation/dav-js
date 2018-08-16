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
 * @class The abstract Class MissionParams represent common parameters of MissionParams classes.
 */
export default abstract class MissionParams extends BasicParams {
    public price: IPrice;
    public id: ID;
    public neederDavId: DavID;
    public vehicleId: DavID;

    // TODO: think if it does make sense let the user give id, but override it anyway when bid is accepted
    constructor(values: Partial<IMissionParams>) {
        super();
        if (!values.price) {
            // TODO: fix grammar
            throw new Error ('price is this a required field');
        }
        if (!values.vehicleId) {
            // TODO: fix grammar
            throw new Error ('vehicleId is this a required field');
        }
        // TODO: need to throw also if there is no neederDavId
        Object.assign(this, values);
        const priceObject = values.price;
        if (typeof priceObject === 'string') {
            this.price = new Price(priceObject as BigInteger, PriceType.flat);
        } else {
            this.price = new Price(priceObject.value, priceObject.type, priceObject.description);
        }
    }
}
