import { ethers } from 'ethers';
import { Database } from './server';

const DEFAULT_TTL = 300; // 5 minutes

const ABI = [
  "function getSubnameOwner(string) view returns (address)",
];

export class DarwiniaDatabase implements Database {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(darwinia_rpc_url: string, darwinia_subname_registry_contract_address: string) {
    this.provider = new ethers.providers.JsonRpcProvider(darwinia_rpc_url);
    this.contract = new ethers.Contract(darwinia_subname_registry_contract_address, ABI, this.provider);
  }

  async addr(name: string, coinType: number): Promise<{ addr: string; ttl: number }> {
    if (coinType !== 60) { // ETH coin type
      return { addr: ethers.constants.AddressZero, ttl: DEFAULT_TTL };
    }

    if (name === 'ringdao.eth') {
      return { addr: '0x1234567890123456789012345678901234567890', ttl: DEFAULT_TTL };
    }

    // "a.b.ringdao.eth" is not allowed. only "a.ringdao.eth" is allowed.
    if (name.split('.').length > 3) {
      return { addr: ethers.constants.AddressZero, ttl: DEFAULT_TTL };
    }

    try {
      console.log('querying', name);
      const subname = name.split('.')[0]
      const owner = await this.contract.getSubnameOwner(subname);
      console.log('owner', owner);
      return { addr: owner, ttl: DEFAULT_TTL };
    } catch (error) {
      console.error('Error fetching subname owner:', error);
      return { addr: ethers.constants.AddressZero, ttl: DEFAULT_TTL };
    }
  }

  async text(_name: string, _key: string): Promise<{ value: string; ttl: number }> {
    // The SubnameRegistry doesn't support text records, so we'll return an empty string
    return { value: '', ttl: DEFAULT_TTL };
  }

  async contenthash(_name: string): Promise<{ contenthash: string; ttl: number }> {
    // The SubnameRegistry doesn't support contenthash, so we'll return an empty string
    return { contenthash: '0x', ttl: DEFAULT_TTL };
  }
}