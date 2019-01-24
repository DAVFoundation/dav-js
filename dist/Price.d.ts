import { BigInteger } from './common-types';
import { PriceType } from './common-enums';
import IPrice from './IPrice';
/**
 * @class The Price class is an implementation of the IPrice interface.
 */
export default class Price implements IPrice {
    value: BigInteger;
    type: PriceType;
    description?: string;
    constructor(value: BigInteger, type: PriceType, description?: string);
    /**
     * @method equals used to compare between two prices object.
     * @param other another price object to compare to current.
     */
    equals(other: Price): boolean;
}
