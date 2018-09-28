"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sdkLogger(message, ...optionalParams) {
    const sdkDebugLog = process.env.SDK_DEBUG_LOG === 'true';
    if (sdkDebugLog) {
        // tslint:disable-next-line:no-console
        console.log(message, ...optionalParams);
    }
}
exports.default = sdkLogger;

//# sourceMappingURL=sdkLogger.js.map
