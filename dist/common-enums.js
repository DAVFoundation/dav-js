"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @enum The enum PriceType represent the type of the price of the service.
 */
var PriceType;
(function (PriceType) {
    PriceType["flat"] = "flat";
})(PriceType = exports.PriceType || (exports.PriceType = {}));
/**
 * @enum The enum BlockchainType represent the type of the blockchain network.
 */
var BlockchainType;
(function (BlockchainType) {
    BlockchainType["local"] = "local";
    BlockchainType["test"] = "ropsten";
    BlockchainType["main"] = "main";
})(BlockchainType = exports.BlockchainType || (exports.BlockchainType = {}));
/**
 * @enum The enum ContractTypes represent the dav contracts names.
 */
var ContractTypes;
(function (ContractTypes) {
    ContractTypes["identity"] = "Identity";
    ContractTypes["davToken"] = "DAVToken";
    ContractTypes["basicMission"] = "BasicMission";
})(ContractTypes = exports.ContractTypes || (exports.ContractTypes = {}));
/**
 * @enum The enum RideHailingMissionStatus represent the mission statuses after the contract has been signed
 *  - all statuses are sent by the driver except PassengerIsComing.
 */
var RideHailingMissionStatus;
(function (RideHailingMissionStatus) {
    RideHailingMissionStatus["OnTheWay"] = "on_the_way";
    RideHailingMissionStatus["VehicleAtPickupLocation"] = "vehicle_at_pickup_location";
    RideHailingMissionStatus["PassengerIsComing"] = "passenger_is_coming";
    RideHailingMissionStatus["RidingHasStarted"] = "riding_has_started";
    RideHailingMissionStatus["RidingHasFinished"] = "riding_has_finished";
})(RideHailingMissionStatus = exports.RideHailingMissionStatus || (exports.RideHailingMissionStatus = {}));

//# sourceMappingURL=common-enums.js.map
