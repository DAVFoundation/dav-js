"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const SDK_1 = require("./SDK");
/**
 * @function SDKFactory create an instance of DAV SDK.
 * @param config DAV configuration object.
 * @returns DavSDK instance with the specified configuration object.
 */
function SDKFactory(config) {
    const configuration = new Config_1.default(config);
    return new SDK_1.default(configuration);
}
exports.default = SDKFactory;

//# sourceMappingURL=SDKFactory.js.map
