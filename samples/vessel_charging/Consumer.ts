// tslint:disable:no-console

import SDKFactory from '../../src/SDKFactory';
import Config from '../../src/Config';
import BidParams from '../../src/vessel-charging/BidParams';
import MissionParams from '../../src/vessel-charging/MissionParams';
import StatusRequestMessageParams from '../../src/vessel-charging/messages/StatusRequestMessageParams';
import VesselStatusMessageParams from '../../src/vessel-charging/messages/VesselStatusMessageParams';
import ChargingArrivalMessageParams from '../../src/vessel-charging/messages/ChargingArrivalMessageParams';
import Identity from '../../src/Identity';
import { EnergySources, Amenities } from '../../src/vessel-charging/enums';
import Mission from '../../src/Mission';
import Bid from '../../src/Bid';
import { enums, NeedParams, NeedFilterParams } from '../../src/vessel-charging';

const printLine = () =>
  console.log(
    '====================================================================================================',
  );

const sdkConfiguration = {
  apiSeedUrls: ['http://localhost:8080'],
  kafkaSeedUrls: ['localhost:9092'],
};

export default class Consumer {
  private _privateKey: string;
  public identity: Identity;

  public async init(davId: string, privateKey: string) {
    this._privateKey = privateKey;
    const config = new Config(sdkConfiguration);
    const davSDK = SDKFactory(config);
    // try {
    //   await davSDK.registerIdentity(davId, davId, privateKey, privateKey);
    // } catch (err) {
    //   /**/
    // }
    if (await davSDK.isRegistered(davId)) {
      this.identity = await davSDK.getIdentity(davId);
    } else {
      throw new Error('Consumer: Identity is not registered');
    }
  }

  public async start() {
    const need = await this.createNeed();
    const bids = await need.bids();
    bids.subscribe(
      async (bid: Bid<BidParams>) => {
        console.log('Bid received: ', bid);
        printLine();
        const mission = await this.createMission(bid);
        this.simulateMission(mission);
      },
      error => console.log(error),
    );
  }

  public async createNeed() {
    const needParams = new NeedParams({
      location: {
        lat: 32.050382,
        long: 34.766149,
      },
      radius: 500,
      startAt: 1535441613658,
      dimensions: {
        length: 1,
        width: 1,
        height: 1,
        weight: 2,
      },
      batteryCapacity: 40,
      currentBatteryCharge: 10,
      energySource: EnergySources.Hydro,
      amenities: [Amenities.Park],
    });
    const need = await this.identity.publishNeed(needParams);
    return need;
  }

  public async createMission(bid: Bid<BidParams>) {
    const missionParams = new MissionParams({});
    const mission = await bid.accept(missionParams, this._privateKey);
    return mission;
  }

  public async simulateMission(mission: Mission<MissionParams>) {
    const startingMessages = await mission.messages(['starting_message']);
    startingMessages.subscribe(
      async message => {
        console.log('Starting message received:', message.params);
        printLine();

        const vesselStatusMessage = new VesselStatusMessageParams({
          location: {
            lat: 32.050382,
            long: 34.766149,
          },
        });
        mission.sendMessage(vesselStatusMessage);
        console.log('Vessel status message sent!');
        printLine();

        const startMissionTransactionReceipt = await mission.signContract(
          this._privateKey,
        );
        console.log(
          'Start mission transaction receipt:',
          startMissionTransactionReceipt,
        );
        printLine();

        const chargingArrivalMessage = new ChargingArrivalMessageParams({});
        mission.sendMessage(chargingArrivalMessage);
        console.log('Charging arrival message sent!');
        printLine();

        const chargingStartedMessages = await mission.messages([
          'charging_started_message',
        ]);
        chargingStartedMessages.subscribe(
          async chargingStartedMessage => {
            console.log(
              'Charging started message received:',
              chargingStartedMessage,
            );
            printLine();

            const statusRequestMessage = new StatusRequestMessageParams({});
            mission.sendMessage(statusRequestMessage);
            console.log('Status request message sent!');
            printLine();
          },
          error => console.log(error),
        );
      },
      error => console.log(error),
    );

    const providerStatusMessages = await mission.messages([
      'provider_status_message',
    ]);
    providerStatusMessages.subscribe(
      message => {
        console.log('Provider status message received:', message.params);
        printLine();
      },
      error => console.log(error),
    );

    const chargingCompleteMessages = await mission.messages([
      'charging_complete_message',
    ]);
    chargingCompleteMessages.subscribe(
      async message => {
        console.log('Charging complete message received:', message.params);
        printLine();

        const finalizeMissionTransactionReceipt = await mission.finalizeMission(
          this._privateKey,
        );
        console.log(
          'Finalize mission transaction receipt: ',
          finalizeMissionTransactionReceipt,
        );
        printLine();
      },
      error => console.log(error),
    );
  }
}

async function main() {
  const consumer = new Consumer();
  await consumer.init(
    '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6',
    'PRIVATE_KEY_FOR_0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6',
  );
  await consumer.start();
}

main().then(() => console.log('Done'), err => console.log(err));
