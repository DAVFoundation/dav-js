import IBasicParams from './IBasicParams';
/**
 * @class The abstract Class BasicParams represent common parameters to all the SDK's Params classes.
 */
export default abstract class BasicParams {
    private _protocol;
    private _type;
    /**
     * Hop limit, in seconds, for the inherited class.
     */
    ttl?: number;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(_protocol: string, _type: string, values?: Partial<IBasicParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    abstract getProtocolTypes(): any;
    deserialize(json: any): void;
}
//# sourceMappingURL=BasicParams.d.ts.map