import SDKFactory from '../../src/SDKFactory';
import NeedParams from '../../src/ride-hailing/NeedParams';
import BidParams from '../../src/ride-hailing/BidParams';
import MessageParams from '../../src/ride-hailing/MessageParams';
import MissionParams from '../../src/ride-hailing/MissionParams';
import Mission from '../../src/Mission';
import Bid from '../../src/Bid';
import IConfig from '../../src/IConfig';

export default async function runConsumer(config?: IConfig) {
    const sdk = SDKFactory({});
    const walletAddress = '0x793712613137ddd477a8e816c59e1f6395fb0de3';
    const davId = walletAddress;
    const walletPrivateKey = '0xe5B822EE748DBAD8BFA3000F37BBD301780CCD316698A5588773597CD870DE3ED';
    const identityPrivateKey = walletPrivateKey;
    if (! (await sdk.isRegistered(davId))) {
        await sdk.registerIdentity(davId, walletAddress, walletPrivateKey, identityPrivateKey);
        console.log(`needer identity ${davId} was registered`);
    }
    const identity = await sdk.getIdentity(davId, config);
    console.log('needer identity created');

    const needParams = new NeedParams({pickupLocation: {Lat: 32.050307, Long: 34.7644916}, destinationLocation: {Lat: 32.050307, Long: 34.7644916}});
    const need = await identity.publishNeed(needParams);
    console.log('need was published');
    const bids = await need.bids(BidParams);

    const onMissionCreated = async (mission: Mission<MissionParams, MessageParams>) => {
        mission.messages(MessageParams);
    };

    const onBid = async (bid: Bid<BidParams, MessageParams>) => {
        console.log(`got bid: ${bid.params.toString()}`);
        const missionParams = new MissionParams({price: bid.params.price, vehicleId: bid.params.vehicleId, neederDavId: davId});
        const mission = await bid.accept(missionParams, walletAddress);
        console.log('bid was accepted');
        onMissionCreated(mission);
    };

    bids.subscribe(
        onBid,
    );
}



