"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const retry = require("retry");
function retryPromise(promiseFactory, options) {
    return new Promise(async (resolve, reject) => {
        options = Object.assign({ retries: 10, minTimeout: 1000, maxTimeout: 20000, forever: false, factor: 2.0, randomize: true }, options);
        const operation = retry.operation(options);
        operation.attempt(currentAttempt => {
            promiseFactory(currentAttempt).then(t => resolve(t), err => {
                if (!operation.retry(err)) {
                    reject(operation.mainError());
                }
            });
        });
    });
}
exports.retryPromise = retryPromise;

//# sourceMappingURL=retryPromise.js.map
