import BaseBidParams from '../BidParams';
import IPrice from '../IPrice';
import Price from '../Price';
import { BigInteger, ID, DavID } from '../common-types';
import IBaseBidParams from '../IBidParams';
import ProtocolTypes from './ProtocolTypes';

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
    private static _type = 'bid';

    /**
     * @property The drone charging plug type.
     */
    public plugType: string;

    public static getMessageType(): string {
        throw BidParams._protocol;
    }

    public static getMessageProtocol(): string {
        throw BidParams._type;
    }

    public static deserialize(json: any): BidParams {
        const bidParams = super.deserialize(json);
        Object.assign(bidParams, {
            plugType: json.plugType,
        });
        return new BidParams(bidParams);
    }

    constructor(values: Partial<IBidParams>) {
        super(values, BidParams._protocol, BidParams._type);
        this.plugType = values.plugType;
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            plugType: this.plugType,
        });
        return formatedParams;
    }

    public equals(other: BidParams): boolean {
        return super.equals(other) && this.plugType === other.plugType;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
