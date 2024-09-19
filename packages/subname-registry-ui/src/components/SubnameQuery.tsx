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
  const [isLoading, setIsLoading] = useState(false)

  const querySubnameOwner = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setQueryResult('')
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS, DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI, provider)
        
        const owner = await contract.getSubnameOwner(inputSubname)
        setQueryResult(owner !== ethers.constants.AddressZero ? owner : 'Subname not registered')
        setQuerySubname(inputSubname)
      } catch (error) {
        console.error('Error querying subname owner:', error)
        setQueryResult('Error querying subname owner')
        setQuerySubname(inputSubname)
      }
    } else {
      setQueryResult('Please install MetaMask to use this feature.')
      setQuerySubname(inputSubname)
    }
    setIsLoading(false)
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }

  const headingStyle: React.CSSProperties = {
    color: '#333',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '20px',
  }

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  }

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  }

  const buttonStyle: React.CSSProperties = {
    width: '100%', // Make button full width
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }

  const resultStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    wordBreak: 'break-all',
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Subname Query</h2>
      <form onSubmit={querySubnameOwner} style={formStyle}>
        <div style={inputContainerStyle}>
          <input
            type="text"
            value={inputSubname}
            onChange={(e) => setInputSubname(e.target.value)}
            placeholder="Enter subname"
            required
            style={inputStyle}
          />
          <span>.ringdao.eth</span>
        </div>
        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? 'Querying...' : 'Query'}
        </button>
      </form>
      {queryResult && querySubname && (
        <div style={resultStyle}>
          <strong>Address of {querySubname}.ringdao.eth:</strong>
          <br />
          {queryResult}
        </div>
      )}
    </div>
  )
}

export default SubnameQuery