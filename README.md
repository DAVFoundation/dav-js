# DAV-JS SDK

[![Gitter chat](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/DAVFoundation/DAV-Contributors)
[![license](https://img.shields.io/github/license/DAVFoundation/dav-js.svg?style=flat-square)](https://github.com/DAVFoundation/dav-js/blob/master/LICENSE)

The DAV JavaScript SDK eases integration of JavaScript, TypeScript, and Node.js code with the DAV Network.

## Sample Code

The following sample shows how an electic boat might define a statement of need for charging services. Typically this will be sent by a boat that is looking for a charging station around certain coordinates that can accommodate it.

This request is sent to the discovery engine which broadcasts the need to DAV identities that can provide this service. Bids are later received in response.

````javascript
const { SDKFactory } = require('dav-js');
const { NeedParams, enums } = require('dav-js/dist/vessel-charging');
const DAV = SDKFactory({
  apiSeedUrls,
  kafkaSeedUrls,
});
const boat = await DAV.getIdentity(boatDavId);

const needParams = new NeedParams({
  location: {
    lat: 32.050382,
    long: 34.766149,
  },
  radius: 20,
  startAt: 1538995253092,
  dimensions: {
    length: 50,
    width: 15,
    height: 20,
  },
  weight: 50000,
  batteryCapacity: 4,
  currentBatteryCharge: 45,
  energySource: enums.EnergySources.Solar,
  amenities: [enums.Amenities.Docking],
});
const need = await boat.publishNeed(needParams);
````

A full working sample can be seen in the [DAV developer portal](https://developers.dav.network/protocols/vessel-charging/).
