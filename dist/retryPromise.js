"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const retry = require("retry");
function retryPromise(promise, options) {
    return new Promise(async (resolve, reject) => {
        const operation = retry.operation(options);
        operation.attempt(() => {
            promise.then(t => resolve(t), err => {
                if (!operation.retry(err)) {
                    reject(operation.mainError());
                }
            });
        });
    });
}
exports.retryPromise = retryPromise;

//# sourceMappingURL=retryPromise.js.map
