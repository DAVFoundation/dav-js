// tslint:disable:no-console

import SDKFactory from '../../src/SDKFactory';
import NeedParams from '../../src/ride-hailing/NeedParams';
import BidParams from '../../src/ride-hailing/BidParams';
import MessageParams from '../../src/ride-hailing/MessageParams';
import MissionParams from '../../src/ride-hailing/MissionParams';
import VehicleLocationMessageParams from '../../src/ride-hailing/VehicleLocationMessageParams';
import Mission from '../../src/Mission';
import Bid from '../../src/Bid';
import IConfig from '../../src/IConfig';
import { RideHailingMissionStatus } from '../../src/common-enums';
import Message from '../../src/Message';

export default async function runConsumer(config?: IConfig) {
    const sdk = SDKFactory({});
    const walletAddress = '0x793712613137ddd477a8e816c59e1f6395fb0de3';
    const davId = walletAddress;
    const walletPrivateKey = '0x5B822EE748DBAD8BFA3000F37BBD301780CCD316698A5588773597CD870DE3ED';
    const identityPrivateKey = walletPrivateKey;
    if (! (await sdk.isRegistered(davId))) {
        await sdk.registerIdentity(davId, walletAddress, walletPrivateKey, identityPrivateKey);
        console.log(`needer identity ${davId} was registered`);
    }
    const identity = await sdk.getIdentity(davId, config);
    console.log('needer identity created');

    const needParams = new NeedParams({davId, pickupLocation: {lat: 32.050307, long: 34.7644916},
                                       destinationLocation: {lat: 32.050307, long: 34.7644916}});
    const need = await identity.publishNeed(needParams);
    console.log('need was published: ', JSON.stringify(needParams));
    const bids = await need.bids();

    const onMissionCreated = async (mission: Mission<MissionParams>) => {
        const locationMessageStream = await mission.messages();
        const messagesStream = await mission.messages();
        messagesStream.subscribe(
            (message: Message<MessageParams>) => {
                console.log(message.messageParams.missionStatus);
                if (message.messageParams.missionStatus === RideHailingMissionStatus.VehicleAtPickupLocation) {
                    console.log('vehicle at location message');
                    message.respond(new MessageParams({missionStatus: RideHailingMissionStatus.PassengerIsComing}));
                }
            },
            (error) => {
                console.log('passenger error: ', error);
            },
        );

        locationMessageStream.subscribe(
            (message: Message<VehicleLocationMessageParams>) => {
                console.log(`status: ${message.messageParams.missionStatus}, location: ${JSON.stringify(message.messageParams.vehicleLocation)}`);
            },
            (error) => {
                console.log('passenger location error: ', error);
            },
        );
    };

    const onBid = async (bid: Bid<BidParams>) => {
        console.log(`got bid: ${JSON.stringify(bid.params)}`);
        const confirmation = await bid.requestCommitment();
        console.log('bid was confirmed');
        const missionParams = new MissionParams({price: bid.params.price, vehicleId: bid.params.vehicleId, neederDavId: davId});
        const mission = await bid.accept(missionParams, walletPrivateKey);
        console.log('bid was accepted');
        onMissionCreated(mission);
    };

    bids.subscribe(
        onBid,
    );
}



