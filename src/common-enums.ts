export enum PriceType {
    flat = 'flat',
}

export enum MessageStatus {
    accepted = 'accepted',
    contractSigned = 'contract_signed',
}

export enum MessageDomain {
    mission = 'mission',
    bid = 'bid',
}

export enum BlockchainType {
    local = 'local',
    ropsten = 'ropsten',
    main = 'main',
}

// TODO: Wrong casing - fix
// TODO: contracts -> ContractTypes
export enum contracts {
    identity = 'Identity',
    davToken = 'DAVToken',
    basicMission = 'BasicMission',
}
