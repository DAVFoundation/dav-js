"use strict";
/*
This script simulate full flow of Contracts use.
To use this script fill in all params.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const Contracts_1 = require("./Contracts");
const Config_1 = require("./Config");
const common_enums_1 = require("./common-enums");
const Price_1 = require("./Price");
const sdkLogger_1 = require("./sdkLogger");
const configuration = new Config_1.default({});
// params start
const MISSION_ID = '0xf3229680B0166F0812e0ECEAd69B1dd144334229';
const MISSION_PRICE = [new Price_1.default('100000000000000000', common_enums_1.PriceType.flat, '')];
const DAV_ID = '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const WALLET_PRIVATE_KEY = 'PRIVATE_KEY_FOR_0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const IDENTITY_PRIVATE_KEY = 'PRIVATE_KEY_FOR_0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const WALLET_ADDRESS = '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const VEHICLE_ID = '0x3e54f4d0A7C93516f962e5cfcB402dB6C2700C30';
// params end
// identityPrivateKey: string, walletAddress
async function main() {
    const printLine = () => sdkLogger_1.default('====================================================================================================');
    const isRegistered = async () => {
        sdkLogger_1.default('Checking if is registered...');
        try {
            const res = await Contracts_1.default.isIdentityRegistered(DAV_ID, configuration);
            sdkLogger_1.default(res);
            printLine();
        }
        catch (err) {
            sdkLogger_1.default(err);
        }
    };
    const registerIdentity = async () => {
        sdkLogger_1.default('Registering identity...');
        try {
            const receipt = await Contracts_1.default.registerIdentity(DAV_ID, IDENTITY_PRIVATE_KEY, WALLET_ADDRESS, WALLET_PRIVATE_KEY, configuration);
            sdkLogger_1.default(receipt);
            printLine();
        }
        catch (err) {
            sdkLogger_1.default(err);
        }
    };
    const approveMission = async () => {
        sdkLogger_1.default('Approving mission...');
        try {
            const receipt = await Contracts_1.default.approveMission(DAV_ID, WALLET_PRIVATE_KEY, configuration);
            sdkLogger_1.default(receipt);
            printLine();
        }
        catch (err) {
            sdkLogger_1.default(err);
        }
    };
    const startMission = async () => {
        sdkLogger_1.default('Starting mission...');
        try {
            const receipt = await Contracts_1.default.startMission(MISSION_ID, DAV_ID, WALLET_PRIVATE_KEY, VEHICLE_ID, MISSION_PRICE, configuration);
            sdkLogger_1.default(receipt);
            printLine();
        }
        catch (err) {
            sdkLogger_1.default(err);
        }
    };
    const finalizeMission = async () => {
        sdkLogger_1.default('Finalizing mission...');
        try {
            const receipt = await Contracts_1.default.finalizeMission(MISSION_ID, DAV_ID, WALLET_PRIVATE_KEY, configuration);
            sdkLogger_1.default(receipt);
            printLine();
        }
        catch (err) {
            sdkLogger_1.default(err);
        }
    };
    const watchMission = () => {
        sdkLogger_1.default('Getting events...');
        try {
            const observable = Contracts_1.default.watchContract(MISSION_ID, common_enums_1.ContractTypes.basicMission, configuration);
            observable.subscribe((event) => {
                sdkLogger_1.default('New event:');
                sdkLogger_1.default(event);
                printLine();
            }, (err) => {
                sdkLogger_1.default('Error:');
                sdkLogger_1.default(err);
                printLine();
            });
            printLine();
        }
        catch (err) {
            sdkLogger_1.default(err);
        }
    };
    const waitASecond = () => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 1000);
        });
    };
    // await registerIdentity();
    // await registerIdentity();
    // watchMission();
    // await approveMission();
    // await startMission();
    // await finalizeMission();
}
main();

//# sourceMappingURL=ContractsIntegrationSimulator.js.map
