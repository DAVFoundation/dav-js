/*
This script simulate full flow of Contracts use.
To use this script fill in all params.
 */

// tslint:disable:no-console
import Contracts from './Contracts';
import Config from './Config';
import { ContractTypes, PriceType } from './common-enums';
import Price from './Price';
const configuration = new Config({});

// params start
const MISSION_ID = '0xf3229680B0166F0812e0ECEAd69B1dd144334229';
const MISSION_PRICE = [new Price('100000000000000000', PriceType.flat, '')];
const DAV_ID = '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const WALLET_PRIVATE_KEY = 'PRIVATE_KEY_FOR_0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const IDENTITY_PRIVATE_KEY = 'PRIVATE_KEY_FOR_0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const WALLET_ADDRESS = '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const VEHICLE_ID = '0x3e54f4d0A7C93516f962e5cfcB402dB6C2700C30';
// params end

// identityPrivateKey: string, walletAddress

async function main(): Promise<void> {

    const printLine = () => console.log('====================================================================================================');

    const isRegistered = async () => {
        console.log('Checking if is registered...');
        try {
            const res = await Contracts.isIdentityRegistered(
                DAV_ID,
                configuration);
            console.log(res);
            printLine();
        } catch (err) {
            console.log(err);
        }
    };

    const registerIdentity = async () => {
        console.log('Registering identity...');
        try {
            const receipt = await Contracts.registerIdentity(
                DAV_ID,
                IDENTITY_PRIVATE_KEY,
                WALLET_ADDRESS,
                WALLET_PRIVATE_KEY,
                configuration);
            console.log(receipt);
            printLine();
        } catch (err) {
            console.log(err);
        }
    };

    const approveMission = async () => {
        console.log('Approving mission...');
        try {
            const receipt = await Contracts.approveMission(
                DAV_ID,
                WALLET_PRIVATE_KEY,
                configuration);
            console.log(receipt);
            printLine();
        } catch (err) {
            console.log(err);
        }
    };

    const startMission = async () => {
        console.log('Starting mission...');
        try {
            const receipt = await Contracts.startMission(
                MISSION_ID,
                DAV_ID,
                WALLET_PRIVATE_KEY,
                VEHICLE_ID,
                MISSION_PRICE,
                configuration);
            console.log(receipt);
            printLine();
        } catch (err) {
            console.log(err);
        }
    };

    const finalizeMission = async () => {
        console.log('Finalizing mission...');
        try {
            const receipt = await Contracts.finalizeMission(MISSION_ID, DAV_ID, WALLET_PRIVATE_KEY, configuration);
            console.log(receipt);
            printLine();
        } catch (err) {
            console.log(err);
        }
    };

    const watchMission = () => {
        console.log('Getting events...');
        try {
            const observable = Contracts.watchContract(MISSION_ID, ContractTypes.basicMission, configuration);
            observable.subscribe((event: any) => {
                console.log('New event:');
                console.log(event);
                printLine();
            },
            (err: any) => {
                console.log('Error:');
                console.log(err);
                printLine();
            });
            printLine();
        } catch (err) {
            console.log(err);
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
