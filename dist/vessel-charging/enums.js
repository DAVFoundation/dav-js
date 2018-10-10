"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnergySources;
(function (EnergySources) {
    EnergySources["Grid"] = "grid";
    EnergySources["Renewable"] = "renewable";
    EnergySources["Solar"] = "solar";
    EnergySources["Wind"] = "wind";
    EnergySources["Hydro"] = "hydro";
    EnergySources["Geothermal"] = "geothermal";
})(EnergySources = exports.EnergySources || (exports.EnergySources = {}));
var Amenities;
(function (Amenities) {
    Amenities[Amenities["Lodging"] = 1] = "Lodging";
    Amenities[Amenities["Dining"] = 2] = "Dining";
    Amenities[Amenities["Restrooms"] = 3] = "Restrooms";
    Amenities[Amenities["Docking"] = 4] = "Docking";
    Amenities[Amenities["Park"] = 5] = "Park";
    Amenities[Amenities["WiFi"] = 6] = "WiFi";
    Amenities[Amenities["Shopping"] = 7] = "Shopping";
    Amenities[Amenities["Grocery"] = 8] = "Grocery";
})(Amenities = exports.Amenities || (exports.Amenities = {}));
var PriceTypes;
(function (PriceTypes) {
    PriceTypes["kwh"] = "kwh";
    PriceTypes["second"] = "second";
    PriceTypes["minute"] = "minute";
    PriceTypes["hour"] = "hour";
    PriceTypes["day"] = "day";
    PriceTypes["week"] = "week";
    PriceTypes["flat"] = "flat";
})(PriceTypes = exports.PriceTypes || (exports.PriceTypes = {}));

//# sourceMappingURL=enums.js.map
