"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class The abstract Class BasicParams represent common parameters to all the SDK's Params classes.
 */
class BasicParams {
    constructor(_protocol, _messageType, values) {
        this._protocol = _protocol;
        this._messageType = _messageType;
        if (!!values) {
            this.ttl = values.ttl;
        }
    }
    serialize() {
        return {
            ttl: this.ttl,
            protocol: this._protocol,
            type: this._messageType,
        };
    }
    get protocol() {
        return this._protocol;
    }
    get messageType() {
        return this._messageType;
    }
    deserialize(json) {
        this.ttl = json.ttl;
    }
}
exports.default = BasicParams;

//# sourceMappingURL=BasicParams.js.map
