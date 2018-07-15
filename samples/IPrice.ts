import { PriceType } from './enums';

export default interface IPrice {
    price: BigInteger; // price in Vinci
    priceType: PriceType;
    priceDescription: string;
}
