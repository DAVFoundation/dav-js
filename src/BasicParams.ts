/**
 * @class The abstract Class BasicParams of DavSDK represent common parameters to all the SDK's Params classes.
 */
export default abstract class BasicParams {
    /**
     * Hop limit, in seconds, for the inherited class.
     */
    public ttl?: number; // TTL in seconds

    public static fromJson(json: any): BasicParams {
        throw new Error('Must be implemented by derived class');
    }

    public static getMessageType(): string {
        throw new Error('Must be implemented by derived class');
    }

    public abstract toJson(): string;
}
