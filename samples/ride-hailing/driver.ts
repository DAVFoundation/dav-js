// tslint:disable:no-console

import SDKFactory from '../../src/SDKFactory';
import NeedFilterParams from '../../src/ride-hailing/NeedFilterParams';
import NeedParams from '../../src/ride-hailing/NeedParams';
import BidParams from '../../src/ride-hailing/BidParams';
import MessageParams from '../../src/ride-hailing/MessageParams';
import VehicleLocationMessageParams from '../../src/ride-hailing/VehicleLocationMessageParams';
import Need from '../../src/Need';
import MissionParams from '../../src/ride-hailing/MissionParams';
import Mission from '../../src/Mission';
import IConfig from '../../src/IConfig';
import { RideHailingMissionStatus } from '../../src/common-enums';
import Message from '../../src/Message';

export default async function runProvider(config?: IConfig) {
    const sdk = SDKFactory({});
    const walletAddress = '0xcD3c518c18A59dB447E21dd9Ec4C02eE56d58812';
    const davId = walletAddress;
    const walletPrivateKey = '0x661ba8e9e20ae01793b0d1bbf7bfba1fbbfd436cfc35bb1972d075069a208b3';
    const identityPrivateKey = walletPrivateKey;
    if (! (await sdk.isRegistered(davId))) {
        await sdk.registerIdentity(davId, walletAddress, walletPrivateKey, identityPrivateKey);
        console.log(`bidder identity ${davId} was registered`);
    }
    const identity = await sdk.getIdentity(davId, config);
    console.log('bidder identity created');

    const needFilterParams = new NeedFilterParams({location: {lat: 32.050307, long: 34.7644916}, radius: 1000 });
    const needs = await identity.needsForType(needFilterParams);
    console.log('need type was sent');

    const onVehicleInRiding = async (message: Message<MessageParams>) => {
        message.respond(new MessageParams({missionStatus: RideHailingMissionStatus.RidingHasStarted}));
        setTimeout(() => message.respond(new MessageParams({missionStatus: RideHailingMissionStatus.RidingHasFinished})), 3000);
    };

    const onMissionCreated = async (oldMission: Mission<MissionParams>) => {
        console.log(`got mission: ${JSON.stringify(oldMission.params)}`);
        const mission = identity.mission(oldMission.id, oldMission.peerId, oldMission.params);
        setTimeout(() => {
            mission.sendMessage(new VehicleLocationMessageParams({vehicleLocation: {lat: 1, long: 2}}));
            mission.sendMessage(new MessageParams({missionStatus: RideHailingMissionStatus.VehicleAtPickupLocation}));
        }, 1000);

        const messageStream = await mission.messages();
        messageStream.subscribe(
            (message: Message<MessageParams>) => {
                console.log(message.params.missionStatus);
                if (message.params.missionStatus === RideHailingMissionStatus.PassengerIsComing) {
                    onVehicleInRiding(message);
                }
            },
            (error) => {
                console.log('driver error: ', error);
            },
        );
    };

    const onNeed = async (need: Need<NeedParams>) => {
        console.log(`got need: ${JSON.stringify(need.params)}`);
        const bidParams = new BidParams({price: '0.1', vehicleId: davId, isCommitted: false});
        // const restoredNeed = identity.need(need.params);
        const bid = await need.createBid(bidParams);
        console.log('bid created');
        let restoredBid = identity.bid(bid.id, bid.params);
        const missions = await restoredBid.missions();
        missions.subscribe(onMissionCreated);
        restoredBid = identity.bid(bid.id, bid.params);
        const requestsStream = await restoredBid.commitmentRequests();
        console.log('got commitment request stream');
        const commitmentRequest = await (requestsStream.first().toPromise());
        console.log('got commitment request');
        await commitmentRequest.confirm();
        console.log('driver commit has been sent');
    };

    needs.subscribe(
        onNeed,
    );
}



