import BaseBidParams from '../BidParams';
import IPrice from '../IPrice';
import Price from '../Price';
import { BigInteger, ID, DavID } from '../common-types';
import IBaseBidParams from '../IBidParams';

/**
 * @interface IBidParams The interface drone-charging/IBidParams represent a valid argument of drone-charging/BidParams constructor.
 */
interface IBidParams extends IBaseBidParams {
    /**
     * @property The drone charging plug type.
     */
    plugType: string;
}
/**
 * @class The Class drone-charging/BidParams represent the parameters of drone-charging bid.
 */
export default class BidParams extends BaseBidParams {

    private static _protocol = 'drone_charging';
    private static _type = 'Bid';

    /**
     * @property The drone charging plug type.
     */
    public plugType: string;

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    constructor(values?: Partial<IBidParams>) {
        super(BidParams._protocol, BidParams._type, values);
        if (!!values) {
            this.plugType = values.plugType;
        }
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            plugType: this.plugType,
        });
        return formatedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.plugType = json.plugType;
    }

    public equals(other: BidParams): boolean {
        return super.equals(other) && this.plugType === other.plugType;
    }
}
