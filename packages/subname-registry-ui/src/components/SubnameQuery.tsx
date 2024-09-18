import React, { useState } from 'react'
import { ethers } from 'ethers'

const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS = '0xf6B8A7C7B82E3Bb3551393931d71987908bF486f'
const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI = [
  "function getSubnameOwner(string) public view returns (address)"
]

const SubnameQuery: React.FC = () => {
  const [inputSubname, setInputSubname] = useState('')
  const [querySubname, setQuerySubname] = useState('')
  const [queryResult, setQueryResult] = useState('')

  const querySubnameOwner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS, DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI, provider)
        
        const owner = await contract.getSubnameOwner(inputSubname)
        setQueryResult(owner !== ethers.constants.AddressZero ? owner : 'Subname not registered')
        setQuerySubname(inputSubname) // Update querySubname after the query is complete
      } catch (error) {
        console.error('Error querying subname owner:', error)
        setQueryResult('Error querying subname owner')
        setQuerySubname(inputSubname) // Update querySubname even if there's an error
      }
    } else {
      setQueryResult('Please install MetaMask to use this feature.')
      setQuerySubname(inputSubname) // Update querySubname even if MetaMask is not available
    }
  }

  return (
    <div>
      <h2>Subname Query</h2>
      <form onSubmit={querySubnameOwner}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={inputSubname}
            onChange={(e) => setInputSubname(e.target.value)}
            placeholder="Enter subname"
            required
            style={{ marginRight: '5px' }}
          />
          <span>.darwinia.eth</span>
        </div>
        <button type="submit">Query</button>
      </form>
      {queryResult && querySubname && (
        <p>Address of {querySubname}.darwinia.eth: {queryResult}</p>
      )}
    </div>
  )
}

export default SubnameQuery