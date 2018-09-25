import IBasicParams from './IBasicParams';
/**
 * @class The abstract Class BasicParams represent common parameters to all the SDK's Params classes.
 */
export default abstract class BasicParams {
    private _protocol;
    private _messageType;
    /**
     * Hop limit, in seconds, for the inherited class.
     */
    ttl?: number;
    constructor(_protocol: string, _messageType: string, values?: Partial<IBasicParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    readonly protocol: string;
    readonly messageType: string;
    deserialize(json: any): void;
}
//# sourceMappingURL=BasicParams.d.ts.map