"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class The Price class is an implementation of the IPrice interface.
 */
class Price {
    constructor(value, type, description) {
        this.value = value;
        this.type = type;
        this.description = description;
        /**/
    }
    /**
     * @method equals used to compare between two prices object.
     * @param other another price object to compare to current.
     */
    equals(other) {
        return (this.value === other.value &&
            this.type === other.type &&
            this.description === other.description);
    }
}
exports.default = Price;

//# sourceMappingURL=Price.js.map
