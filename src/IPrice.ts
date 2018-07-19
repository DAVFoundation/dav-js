import { BigInteger } from './common-types';
import { PriceType } from './common-enums';

export default interface IPrice {
    value: BigInteger; // price in Vinci
    type: PriceType;
    description?: string;
}
