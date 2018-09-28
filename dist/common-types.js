"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
/**
 * @type The type Observable represent the SDK observable object that used to subscribe to Needs/Bids/Messages/etc...
 */
class Observable extends rxjs_1.Observable {
    constructor() {
        super();
    }
    static fromObservable(observableRx, topic) {
        const observable = observableRx;
        observable.topic = topic;
        return observable;
    }
}
exports.Observable = Observable;

//# sourceMappingURL=common-types.js.map
