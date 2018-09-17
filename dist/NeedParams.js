"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParams_1 = require("./BasicParams");
/**
 * @class The abstract Class NeedParams represent common parameters of NeedParams classes.
 */
class NeedParams extends BasicParams_1.default {
    constructor(protocol, type, values) {
        super(protocol, type, values);
        if (!!values) {
            this.id = values.id;
            this.davId = values.davId;
            if (!!values.location) {
                this.location = {
                    lat: values.location.lat,
                    long: values.location.long,
                };
            }
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            id: this.id,
            location: {
                latitude: this.location && this.location.lat,
                longitude: this.location && this.location.long,
            },
            davId: this.davId,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.id = json.id;
        this.location = {
            lat: json.location && json.location.latitude,
            long: json.location && json.location.longitude,
        };
        this.davId = json.davId;
    }
}
exports.default = NeedParams;

//# sourceMappingURL=NeedParams.js.map
