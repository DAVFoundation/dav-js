"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParams_1 = require("./BasicParams");
const geodesy_1 = require("geodesy");
/**
 * @class The abstract Class NeedFilterParams represent common parameters of NeedFilterParams classes.
 */
class NeedFilterParams extends BasicParams_1.default {
    constructor(protocol, type, values) {
        super(protocol, type, values);
        if (!!values) {
            this.location = values.location;
            this.davId = values.davId;
            this.radius = parseFloat((values.radius).toFixed(1));
        }
    }
    serialize() {
        const formatArea = (area) => {
            const center = new geodesy_1.LatLonSpherical(area.lat, area.long);
            const distance = area.radius * Math.sqrt(2);
            const topLeft = center.destinationPoint(distance, 45);
            const bottomRight = center.destinationPoint(-distance, 45);
            return {
                max: {
                    latitude: parseFloat((topLeft.lat).toFixed(6)),
                    longitude: parseFloat((topLeft.lon).toFixed(6)),
                },
                min: {
                    latitude: parseFloat((bottomRight.lat).toFixed(6)),
                    longitude: parseFloat((bottomRight.lon).toFixed(6)),
                },
            };
        };
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            davId: this.davId,
            area: formatArea(Object.assign({}, this.location, { radius: this.radius })),
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        const formatArea = (area) => {
            const topLeft = new geodesy_1.LatLonSpherical(area.max.latitude, area.max.longitude);
            const bottomRight = new geodesy_1.LatLonSpherical(area.min.latitude, area.min.longitude);
            const distance = topLeft.distanceTo(bottomRight);
            const center = topLeft.intermediatePointTo(bottomRight, 0.5);
            return {
                lat: parseFloat((center.lat).toFixed(6)),
                long: parseFloat((center.lon).toFixed(6)),
                radius: parseFloat(((distance / 2) / Math.sqrt(2)).toFixed(1)),
            };
        };
        const formattedArea = formatArea(json.area);
        this.davId = json.davId;
        this.location = { lat: formattedArea.lat, long: formattedArea.long };
        this.radius = formattedArea.radius;
    }
}
exports.default = NeedFilterParams;

//# sourceMappingURL=NeedFilterParams.js.map
