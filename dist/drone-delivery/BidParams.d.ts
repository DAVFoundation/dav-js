import BaseBidParams from '../BidParams';
import IBaseBidParams from '../IBidParams';
/**
 * @interface IBidParams The interface drone-delivery/IBidParams represent a valid argument of drone-delivery/BidParams constructor.
 */
interface IBidParams extends IBaseBidParams {
    /**
     * @property Estimated time from contract signing to delivery in seconds.
     */
    eta: number;
}
/**
 * @class The Class drone-delivery/BidParams represent the parameters of drone-delivery bid.
 */
export default class BidParams extends BaseBidParams {
    private static _protocol;
    private static _type;
    /**
     * @property Estimated time from contract signing to delivery in seconds.
     */
    eta?: number;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values: Partial<IBidParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
    equals(other: BidParams): boolean;
}
export {};
//# sourceMappingURL=BidParams.d.ts.map