// tslint:disable:no-console
import { SDKFactory, Mission, IConfig, Message, Need } from '../../src';
import {
  NeedFilterParams,
  NeedParams,
  BidParams,
  MessageParams,
  VehicleLocationMessageParams,
  MissionParams,
  MissionStatus,
} from '../../src/ride-hailing';
import config from './config';

async function runProvider(configuration?: IConfig) {
  return new Promise(async (resolve, reject) => {
    try {
      const sdk = SDKFactory({});
      const walletAddress = '0xcD3c518c18A59dB447E21dd9Ec4C02eE56d58812';
      const davId = walletAddress;
      const walletPrivateKey =
        '0x661ba8e9e20ae01793b0d1bbf7bfba1fbbfd436cfc35bb1972d075069a208b3';
      const identityPrivateKey = walletPrivateKey;
      if (!(await sdk.isRegistered(davId))) {
        await sdk.registerIdentity(
          davId,
          walletAddress,
          walletPrivateKey,
          identityPrivateKey,
        );
        console.log(`bidder identity ${davId} was registered`);
      }
      const identity = await sdk.getIdentity(davId, configuration);
      console.log('bidder identity created');

      const needFilterParams = new NeedFilterParams({
        location: { lat: 32.050307, long: 34.7644916 },
        radius: 1000,
      });
      const needs = await identity.needsForType(needFilterParams);
      console.log('need type was sent');

      const onVehicleInRiding = async (message: Message<MessageParams>) => {
        message.respond(
          new MessageParams({
            missionStatus: MissionStatus.RidingHasStarted,
          }),
        );
        setTimeout(() => {
          message.respond(
            new MessageParams({
              missionStatus: MissionStatus.RidingHasFinished,
            }),
          );
          resolve();
        }, 3000);
      };

      const onMissionCreated = async (oldMission: Mission<MissionParams>) => {
        console.log(`got mission: ${JSON.stringify(oldMission.params)}`);
        const mission = identity.mission(
          oldMission.id,
          oldMission.peerId,
          oldMission.params,
        );
        setTimeout(() => {
          mission.sendMessage(
            new VehicleLocationMessageParams({
              vehicleLocation: { lat: 1, long: 2 },
            }),
          );
          mission.sendMessage(
            new MessageParams({
              missionStatus: MissionStatus.VehicleAtPickupLocation,
            }),
          );
        }, 1000);

        const messageStream = await mission.messages();
        messageStream.subscribe(
          (message: Message<MessageParams>) => {
            console.log(message.params.missionStatus);
            if (
              message.params.missionStatus === MissionStatus.PassengerIsComing
            ) {
              onVehicleInRiding(message);
            }
          },
          error => {
            console.log('driver error 1: ', error);
          },
        );
      };

      const onNeed = async (need: Need<NeedParams>) => {
        console.log(`got need: ${JSON.stringify(need.params)}`);
        const bidParams = new BidParams({
          price: '0.1',
          vehicleId: davId,
          isCommitted: false,
        });
        // const restoredNeed = identity.need(need.params);
        const bid = await need.createBid(bidParams);
        console.log('bid created');
        // let restoredBid = identity.bid(bid.id, bid.params);
        const missions = await bid.missions();
        missions.subscribe(onMissionCreated, error => {
          console.log('driver error 2: ', error);
        });
        // restoredBid = identity.bid(bid.id, bid.params);
        const requestsStream = await bid.commitmentRequests();
        console.log('got commitment request stream');
        const commitmentRequest = await requestsStream.first().toPromise();
        console.log('got commitment request');
        await commitmentRequest.confirm();
        console.log('driver commit has been sent');
      };

      needs.subscribe(onNeed, error => {
        console.log('driver error 3: ', error);
      });
    } catch (err) {
      reject(err);
    }
  });
}

runProvider(config).then(
  () => {
    // tslint:disable-next-line:no-console
    console.log(`Driver Done.`);
    process.exit();
  },
  err => {
    // tslint:disable-next-line:no-console
    console.log(`Driver Error: ${err}`);
    process.exit();
  },
);
