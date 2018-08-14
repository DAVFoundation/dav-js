import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, BigInteger, DavID } from './common-types';
import Price from './Price';
import { PriceType } from './common-enums';

/**
 * @interface IBidParams The interface IBidParams represent a valid argument of BidParams constructor.
 */
interface IBidParams {
    /**
     * @property The bid's topic id (used to send messages to service provider).
     */
    id: ID;
    /**
     * @property The bid's price (required).
     */
    price: IPrice | BigInteger;
    /**
     * @property The bid's vehicle DAV Id (required).
     */
    vehicleId: DavID;
    /**
     * @property Topic id for mission (Identity.needsForType().topic).
     */
    needTypeId: ID;
}
/**
 * @class The abstract Class BidParams represent common parameters of BidParams classes.
 */
export default abstract class BidParams extends BasicParams {
    public id: ID;
    public price: IPrice;
    public vehicleId: DavID;
    public needTypeId: ID;

    public constructor(values: Partial<IBidParams>) {
        super();
        if (!values.price) {
            throw new Error('price is this a required field');
        }
        if (!values.vehicleId) {
            throw new Error('vehicleId is this a required field');
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
