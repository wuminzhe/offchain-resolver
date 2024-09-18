import React from 'react'
import SubnameRegistration from '../components/SubnameRegistration'
import SubnameQuery from '../components/SubnameQuery'
import SubnameManagement from '../components/SubnameManagement'

const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS = '0xf6B8A7C7B82E3Bb3551393931d71987908bF486f'
const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI = [
  "function owner() public view returns (address)"
]

const Home: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  }

  const headingStyle: React.CSSProperties = {
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Darwinia Subname Registry</h1>
      {DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS ? (
        <>
          <SubnameRegistration />
          <SubnameQuery />
          <SubnameManagement />
        </>
      ) : (
        <p style={{ textAlign: 'center', color: 'red' }}>Error: Darwinia Subname Registry contract address is not set</p>
      )}
    </div>
  )
}

export default Home