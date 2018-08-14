import { BigInteger } from './common-types';
import { PriceType } from './common-enums';
/**
 * @interface IPrice Represent a mission price.
 */
export default interface IPrice {
    /**
     * @property The price value in Vinci.
     */
    value: BigInteger;
    /**
     * @property The price type.
     */
    type: PriceType;
    /**
     * @property general description of the price.
     */
    description?: string;
    /**
     * @method equals Used to compare between two price objects.
     */
    equals(other: IPrice): boolean;
}
