import BaseBidParams from '../BidParams';
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
    private static _protocol;
    private static _type;
    /**
     * @property The drone charging plug type.
     */
    plugType: string;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<IBidParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
    equals(other: BidParams): boolean;
    getProtocolTypes(): {
        need_filter: typeof import("./NeedFilterParams").default;
        need: typeof import("./NeedParams").default;
        bid: typeof BidParams;
        mission: typeof import("./MissionParams").default;
        message: typeof import("./MessageParams").default;
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
}
export {};
//# sourceMappingURL=BidParams.d.ts.map