import * as retry from 'retry';

export function retryPromise<T>(
  promise: Promise<T>,
  options?: retry.OperationOptions,
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    const operation = retry.operation(options);
    operation.attempt(() => {
      promise.then(
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
