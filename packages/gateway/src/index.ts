import { makeApp } from './server';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { ethers } from 'ethers';
import { DarwiniaDatabase } from './darwiniaDb';

const program = new Command();
program
  .requiredOption(
    '-k --private-key <key>',
    'Private key to sign responses with. Prefix with @ to read from a file'
  )
  .requiredOption('-d --darwinia-rpc-url <url>', 'Darwinia RPC URL')
  .requiredOption('-c --darwinia-subname-registry-contract-address <address>', 'Darwinia Subname Registry Contract Address')
  .option('-t --ttl <number>', 'TTL for signatures', '300')
  .option('-p --port <number>', 'Port number to serve on', '8080');

program.parse(process.argv);
const options = program.opts();

let privateKey = options.privateKey;
if (privateKey.startsWith('@')) {
  privateKey = ethers.utils.arrayify(
    readFileSync(privateKey.slice(1), { encoding: 'utf-8' })
  );
}

const signingAddress = ethers.utils.computeAddress(privateKey);
const signer = new ethers.utils.SigningKey(privateKey);

const db = new DarwiniaDatabase(options.darwiniaRpcUrl, options.darwiniaSubnameRegistryContractAddress);
const app = makeApp(signer, '/', db);

console.log(`Serving on port ${options.port}`);
console.log(`signingAddress: ${signingAddress}`);
console.log(`darwiniaRpcUrl: ${options.darwiniaRpcUrl}`);
console.log(`darwiniaSubnameRegistry: ${options.darwiniaSubnameRegistryContractAddress}`);

app.listen(parseInt(options.port));

module.exports = app;
