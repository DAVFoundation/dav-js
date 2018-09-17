"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class The abstract Class BasicParams represent common parameters to all the SDK's Params classes.
 */
class BasicParams {
    constructor(_protocol, _type, values) {
        this._protocol = _protocol;
        this._type = _type;
        if (!!values) {
            this.ttl = values.ttl;
        }
    }
    static getMessageType() {
        throw new Error('Must be implemented by derived class');
    }
    static getMessageProtocol() {
        throw new Error('Must be implemented by derived class');
    }
    serialize() {
        return {
            ttl: this.ttl,
            protocol: this._protocol,
            type: this._type,
        };
    }
    deserialize(json) {
        this.ttl = json.ttl;
    }
}
exports.default = BasicParams;

//# sourceMappingURL=BasicParams.js.map
