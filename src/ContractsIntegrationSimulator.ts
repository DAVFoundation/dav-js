/*
This script simulate full flow of Contracts use.
To use this script fill in all params.
 */

// tslint:disable:no-console
import Contracts from './Contracts';
import Config from './Config';
import { ContractTypes, PriceType } from './common-enums';
import Price from './Price';
import sdkLogger from './sdkLogger';
const configuration = new Config({});

// params start
const MISSION_ID = '0xf3229680B0166F0812e0ECEAd69B1dd144334229';
const MISSION_PRICE = [new Price('100000000000000000', PriceType.flat, '')];
const DAV_ID = '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const WALLET_PUBLIC_KEY = '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const WALLET_PRIVATE_KEY =
  'PRIVATE_KEY_FOR_0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const IDENTITY_PRIVATE_KEY =
  'PRIVATE_KEY_FOR_0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const WALLET_ADDRESS = '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6';
const VEHICLE_ID = '0x3e54f4d0A7C93516f962e5cfcB402dB6C2700C30';
// params end

// identityPrivateKey: string, walletAddress

async function main(): Promise<void> {
  const printLine = () =>
    sdkLogger(
      '====================================================================================================',
    );

  const isRegistered = async () => {
    sdkLogger('Checking if is registered...');
    try {
      const res = await Contracts.isIdentityRegistered(DAV_ID, configuration);
      sdkLogger(res);
      printLine();
    } catch (err) {
      sdkLogger(err);
    }
  };

  const registerIdentity = async () => {
    sdkLogger('Registering identity...');
    try {
      const receipt = await Contracts.registerIdentity(
        DAV_ID,
        IDENTITY_PRIVATE_KEY,
        WALLET_ADDRESS,
        WALLET_PRIVATE_KEY,
        configuration,
      );
      sdkLogger(receipt);
      printLine();
    } catch (err) {
      sdkLogger(err);
    }
  };

  const approveMission = async () => {
    sdkLogger('Approving mission...');
    try {
      const receipt = await Contracts.approveMission(
        DAV_ID,
        WALLET_PRIVATE_KEY,
        configuration,
      );
      sdkLogger(receipt);
      printLine();
    } catch (err) {
      sdkLogger(err);
    }
  };

  const startMission = async () => {
    sdkLogger('Starting mission...');
    try {
      const receipt = await Contracts.startMission(
        MISSION_ID,
        DAV_ID,
        WALLET_PUBLIC_KEY,
        WALLET_PRIVATE_KEY,
        VEHICLE_ID,
        configuration,
      );
      sdkLogger(receipt);
      printLine();
    } catch (err) {
      sdkLogger(err);
    }
  };

  const finalizeMission = async () => {
    sdkLogger('Finalizing mission...');
    try {
      const receipt = await Contracts.finalizeMission(
        MISSION_ID,
        DAV_ID,
        WALLET_PUBLIC_KEY,
        WALLET_PRIVATE_KEY,
        configuration,
      );
      sdkLogger(receipt);
      printLine();
    } catch (err) {
      sdkLogger(err);
    }
  };

  const watchMission = () => {
    sdkLogger('Getting events...');
    try {
      const observable = Contracts.watchContract(
        MISSION_ID,
        ContractTypes.basicMission,
        configuration,
      );
      observable.subscribe(
        (event: any) => {
          sdkLogger('New event:');
          sdkLogger(event);
          printLine();
        },
        (err: any) => {
          sdkLogger('Error:');
          sdkLogger(err);
          printLine();
        },
      );
      printLine();
    } catch (err) {
      sdkLogger(err);
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
