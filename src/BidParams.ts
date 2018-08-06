import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, BigInteger } from './common-types';
import Price from './Price';
import { PriceType } from './common-enums';

export default abstract class BidParams extends BasicParams {
    public price: IPrice;

    public constructor(public bidderId: ID, price: IPrice | BigInteger, public vehicleId: ID) {
        super();
        const priceObject = price as IPrice;
        if (!!priceObject) {
            this.price = new Price(priceObject.value, priceObject.type, priceObject.description);
        } else {
            this.price = new Price(price as BigInteger, PriceType.flat);
        }
    }
}
