import { ethers } from 'ethers';
import { Database } from './server';

const DARWINIA_RPC_URL = 'https://koi-rpc.darwinia.network';
const CONTRACT_ADDRESS = '0x3173c3e608125226A0069ba75f8feb73b221974a'; // Replace with the actual deployed contract address
const DEFAULT_TTL = 300; // 5 minutes

const ABI = [
  "function getSubnameOwner(string) view returns (address)",
];

export class DarwiniaDatabase implements Database {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(DARWINIA_RPC_URL);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, this.provider);
  }

  async addr(name: string, coinType: number): Promise<{ addr: string; ttl: number }> {
    if (coinType !== 60) { // ETH coin type
      return { addr: ethers.constants.AddressZero, ttl: DEFAULT_TTL };
    }

    try {
      const owner = await this.contract.getSubnameOwner(name);
      return { addr: owner, ttl: DEFAULT_TTL };
    } catch (error) {
      console.error('Error fetching subname owner:', error);
      return { addr: ethers.constants.AddressZero, ttl: DEFAULT_TTL };
    }
  }

  async text(_name: string, _key: string): Promise<{ value: string; ttl: number }> {
    // The DarwiniaSubnameRegistry doesn't support text records, so we'll return an empty string
    return { value: '', ttl: DEFAULT_TTL };
  }

  async contenthash(_name: string): Promise<{ contenthash: string; ttl: number }> {
    // The DarwiniaSubnameRegistry doesn't support contenthash, so we'll return an empty string
    return { contenthash: '0x', ttl: DEFAULT_TTL };
  }
}