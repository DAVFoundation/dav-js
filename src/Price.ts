import { BigInteger } from './common-types';
import { PriceType } from './common-enums';
import IPrice from './IPrice';
/**
 * @class The Price class is an implementation of the IPrice interface.
 */
export default class Price implements IPrice {

    public constructor(public value: BigInteger, public type: PriceType, public description?: string) {
        /**/
    }
    /**
     * @method equals used to compare between two prices object.
     * @param other another price object to compare to current.
     */
    public equals(other: Price) {
        return this.value === other.value && this.type === other.type && this.description === other.description;
    }
}
