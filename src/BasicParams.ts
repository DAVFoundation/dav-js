

export default abstract class BasicParams {
    public ttl?: number; // TTL in seconds

    public abstract toJson(): string;
}
