import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, DavID, BigInteger } from './common-types';
import Price from './Price';
import { PriceType } from './common-enums';
import IMissionParams from './IMissionParams';
import BidParams from './BidParams';

/**
 * @class The abstract Class MissionParams represent common parameters of MissionParams classes.
 */
export default abstract class MissionParams extends BasicParams {
  public price: IPrice[];
  public id: ID;
  public neederDavId: DavID;
  public vehicleId: DavID;

  // TODO: think if it does make sense let the user give id, but override it anyway when bid is accepted
  constructor(
    protocol: string,
    type: string,
    values?: Partial<IMissionParams>,
  ) {
    super(protocol, type, values);
    if (!!values) {
      this.id = values.id;
      this.vehicleId = values.vehicleId;
      this.neederDavId = values.neederDavId;
      let priceObject = values.price;
      if (priceObject) {
        priceObject =
          values.price instanceof Array ? values.price : [values.price];
        priceObject.map(
          (price: string | IPrice): IPrice => {
            return typeof price === 'string'
              ? new Price(price as BigInteger, PriceType.flat)
              : new Price(price.value, price.type, price.description);
          },
        );
        this.price = priceObject as IPrice[];
      }
    }
  }

  public serialize() {
    const formattedParams = super.serialize();
    Object.assign(formattedParams, {
      id: this.id,
      price: this.price,
      vehicleId: this.vehicleId,
      neederDavId: this.neederDavId,
    });
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
    this.id = json.id;
    this.price = json.price;
    this.vehicleId = json.vehicleId;
    this.neederDavId = json.neederDavId;
  }
}
