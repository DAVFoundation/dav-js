export default abstract class BasicParams {
    public ttl?: number; // TTL in seconds

    public static fromJson(json: any): BasicParams {
        throw new Error('Must be implemented by derived class');
    }

    public static getMessageType(): string {
        throw new Error('Must be implemented by derived class');
    }

    // constructor(values: Partial<BasicParams>) {
    //     Object.assign(this, values);
    // }

    public abstract toJson(): string;
}
