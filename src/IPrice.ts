import { BigInteger } from './common';
import { PriceType } from './enums';

export default interface IPrice {
    value: BigInteger; // price in Vinci
    type: PriceType;
    description?: string;
}
