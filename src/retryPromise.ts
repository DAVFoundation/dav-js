import * as retry from 'retry';

export function retryPromise<T>(
  promiseFactory: (currentAttempt: number) => Promise<T>,
  options?: retry.OperationOptions,
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    options = {
      retries: 10,
      minTimeout: 1000,
      maxTimeout: 20000,
      forever: false,
      factor: 2.0,
      randomize: true,
      ...options,
    };
    const operation = retry.operation(options);
    operation.attempt(currentAttempt => {
      promiseFactory(currentAttempt).then(
        t => resolve(t),
        err => {
          if (!operation.retry(err)) {
            reject(operation.mainError());
          }
        },
      );
    });
  });
}
