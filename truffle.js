module.exports = {
  contracts_directory: './node_modules/dav-contracts/contracts',
  migrations_directory: './node_modules/dav-contracts/migrations',
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    }
  }
};
