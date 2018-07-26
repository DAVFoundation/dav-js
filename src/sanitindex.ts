import Contracts from './Contracts';
import Config from './Config';

const configuration = new Config({});

async function main(): Promise<void> {

    const isRegistered = async () => {
        try {
            const res = await Contracts.isIdentityRegistered(
                '0x456d05B7B8563444a5edd392ADe2CDd77996f686',
                configuration);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    const registerIdentity = () => {
        try {
            const recipt = Contracts.registerIdentity(
                '0x456d05B7B8563444a5edd392ADe2CDd77996f686',
                '0x158d065c8c11c5266bd672dd405b7ec002a004f1ff188821b1ca269759658c0f',
                '0x3e54f4d0A7C93516f962e5cfcB402dB6C2700C30',
                '0xbddb7b9db954ef175e2dafbcdf4fde2ae9b9533eaac3a5ed3739a6b37f215c3b',
                configuration);
            console.log(recipt);
        } catch (err) {
            console.log(err);
        }
    };

    const aproveMision = async () => {
        try {
            const recipt = Contracts.aproveMision(
                '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6',
                '0x68d82032ad0bd5eaeae8f7c2757f861ab12186c37f0c037c0a18f959a09ecbe9',
                configuration);
            console.log(recipt);
        } catch (err) {
            console.log(err);
        }
    };

    const startMision = async () => {
        try {
            const recipt = await Contracts.startMision(
                '0x672bADdF2b76af5C2C218F3B9DBa110d98cb28A7',
                '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6',
                '0x68d82032ad0bd5eaeae8f7c2757f861ab12186c37f0c037c0a18f959a09ecbe9',
                '0x4AB99352BB486F0C63f1e52B6227f58f83E764B1',
                '0',
                configuration);
            console.log(recipt);
        } catch (err) {
            console.log(err);
        }
    };


    const finalizeMission = () => {
        try {
            const recipt = Contracts.finalizeMission(
                '0xe5058Fa105f249B444982506cfdB159fe74ac599',
                '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6',
                '0x68d82032ad0bd5eaeae8f7c2757f861ab12186c37f0c037c0a18f959a09ecbe9',
                configuration);
            console.log(recipt);
        } catch (err) {
            console.log(err);
        }
    };


    startMision();


}

main();
