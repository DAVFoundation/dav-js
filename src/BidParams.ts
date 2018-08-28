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
    public price: IPrice[];
    public vehicleId: DavID;
    public neederDavId: DavID;

    public static deserialize(json: any) {
        const bidParams = super.deserialize(json);
        Object.assign(bidParams, {
            id: json.id,
            price: json.price,
            vehicleId: json.vehicleId,
            neederDavId: json.neederDavId,
        });
        return bidParams as BidParams;
    }

    public constructor(values: Partial<IBidParams>, protocol: string, type: string) {
        if (!values.price) {
            throw new Error('price is a required field');
        }
        if (!values.vehicleId) {
            throw new Error('vehicleId is a required field');
        }
        super(values, protocol, type);
        this.id = values.id;
        this.vehicleId = values.vehicleId;
        this.neederDavId = values.neederDavId;
        const priceObject = values.price instanceof Array ? values.price : [values.price];
        priceObject.map((price: string | IPrice): IPrice => {
            return typeof price === 'string' ?
            new Price(price as BigInteger, PriceType.flat) :
            new Price(price.value, price.type, price.description);
        });
        this.price = priceObject as IPrice[];
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            id: this.id,
            price: this.price,
            vehicleId: this.vehicleId,
            neederDavId: this.neederDavId,
            ttl: this.ttl,
        });
        return formattedParams;
    }

    public equals(other: BidParams): boolean {
        const isPriceEqual = this.price.map((price, index) =>
            other.price[index] && price.equals(other.price[index]))
            .find((x: any) => !x) === undefined;
        return this.ttl === other.ttl && isPriceEqual
            && this.vehicleId === other.vehicleId
            && this.neederDavId === other.neederDavId;
    }

}
