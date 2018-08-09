import BasicParams from './BasicParams';
import { ID, DavID, BigInteger } from './common-types';
import IPrice from './IPrice';
import Price from './Price';
import { PriceType } from './common-enums';

export default abstract class MissionParams extends BasicParams {
    public price: IPrice;

    constructor(public id: ID, public neederDavId: DavID, public vehicleId: DavID, price: IPrice | BigInteger) {
        super();
        const priceObject = price as IPrice;
        if (!!priceObject) {
            this.price = new Price(priceObject.value, priceObject.type, priceObject.description);
        } else {
            this.price = new Price(price as BigInteger, PriceType.flat);
        }
    }
}
