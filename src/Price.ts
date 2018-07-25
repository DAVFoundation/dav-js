import { BigInteger } from './common-types';
import { PriceType } from './common-enums';
import IPrice from './IPrice';

export default class Price implements IPrice {

    public constructor(public value: BigInteger, public type: PriceType, public description?: string) {
        /**/
    }

    public equals(other: Price) {
        return this.value === other.value && this.type === other.type && this.description === other.description;
    }
}
