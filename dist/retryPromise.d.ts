import * as retry from 'retry';
export declare function retryPromise<T>(promiseFactory: (currentAttempt: number) => Promise<T>, options?: retry.OperationOptions): Promise<T>;
