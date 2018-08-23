import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, BigInteger, DavID } from './common-types';
import Price from './Price';
import { PriceType } from './common-enums';
import IBidParams from './IBidParams';

/**
 * @class The abstract Class BidParams represent common parameters of BidParams classes.
 */
export default abstract class BidParams extends BasicParams {
    public id: ID;
    public price: IPrice;
    public vehicleId: DavID;
    public neederDavId: DavID;

    public constructor(values: Partial<IBidParams>) {
        if (!values.price) {
            throw new Error('price is this a required field');
        }
        if (!values.vehicleId) {
            throw new Error('vehicleId is this a required field');
        }
        super(values);
        this.id = values.id;
        this.vehicleId = values.vehicleId;
        this.neederDavId = values.neederDavId;
        const priceObject = values.price;
        if (typeof priceObject === 'string') {
            this.price = new Price(priceObject as BigInteger, PriceType.flat);
        } else {
            this.price = new Price(priceObject.value, priceObject.type, priceObject.description);
        }
    }
}
