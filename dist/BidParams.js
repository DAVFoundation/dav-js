"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParams_1 = require("./BasicParams");
const Price_1 = require("./Price");
const common_enums_1 = require("./common-enums");
/**
 * @class The abstract Class BidParams represent common parameters of BidParams classes.
 */
class BidParams extends BasicParams_1.default {
    constructor(protocol, type, values) {
        if (!values) {
            super(protocol, type);
        }
        else {
            if (!values.price) {
                throw new Error('price is a required field');
            }
            if (!values.vehicleId) {
                throw new Error('vehicleId is a required field');
            }
            super(protocol, type, values);
            this.id = values.id;
            this.vehicleId = values.vehicleId;
            this.neederDavId = values.neederDavId;
            this.isCommitted = values.isCommitted === false ? false : true;
            const priceObject = values.price instanceof Array ? values.price : [values.price];
            priceObject.map((price) => {
                return typeof price === 'string' ?
                    new Price_1.default(price, common_enums_1.PriceType.flat) :
                    new Price_1.default(price.value, price.type, price.description);
            });
            this.price = priceObject;
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            id: this.id,
            price: this.price,
            vehicleId: this.vehicleId,
            neederDavId: this.neederDavId,
            isCommitted: this.isCommitted,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.id = json.id;
        this.price = json.price;
        this.vehicleId = json.vehicleId;
        this.neederDavId = json.neederDavId;
        this.isCommitted = json.isCommitted;
    }
    equals(other) {
        const isPriceEqual = this.price.map((price, index) => other.price[index] && price.equals(other.price[index]))
            .find((x) => !x) === undefined;
        return this.ttl === other.ttl && isPriceEqual
            && this.vehicleId === other.vehicleId
            && this.neederDavId === other.neederDavId;
    }
}
exports.default = BidParams;

//# sourceMappingURL=BidParams.js.map
