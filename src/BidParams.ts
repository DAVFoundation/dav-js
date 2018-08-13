import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, BigInteger } from './common-types';
import Price from './Price';
import { PriceType } from './common-enums';

export default abstract class BidParams extends BasicParams {
    public id: ID;
    public price: IPrice;
    public vehicleId: ID;
    public needTypeId: ID;

    public constructor(values: Partial<BidParams>) {
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
