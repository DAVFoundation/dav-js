"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParams_1 = require("./BasicParams");
const Price_1 = require("./Price");
const common_enums_1 = require("./common-enums");
/**
 * @class The abstract Class MissionParams represent common parameters of MissionParams classes.
 */
class MissionParams extends BasicParams_1.default {
    // TODO: think if it does make sense let the user give id, but override it anyway when bid is accepted
    constructor(protocol, type, values) {
        super(protocol, type, values);
        if (!!values) {
            this.id = values.id;
            this.vehicleId = values.vehicleId;
            this.neederDavId = values.neederDavId;
            let priceObject = values.price;
            if (priceObject) {
                priceObject =
                    values.price instanceof Array ? values.price : [values.price];
                priceObject.map((price) => {
                    return typeof price === 'string'
                        ? new Price_1.default(price, common_enums_1.PriceType.flat)
                        : new Price_1.default(price.value, price.type, price.description);
                });
                this.price = priceObject;
            }
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            id: this.id,
            price: this.price,
            vehicleId: this.vehicleId,
            neederDavId: this.neederDavId,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.id = json.id;
        this.price = json.price;
        this.vehicleId = json.vehicleId;
        this.neederDavId = json.neederDavId;
    }
}
exports.default = MissionParams;

//# sourceMappingURL=MissionParams.js.map
