import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS = '0x000dFde2A09e3b8C303B3174B5b4C91B22eE8bb2'
const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI = [
  "function registerSubname(string)",
  "function getSubnameForAddress(address addr) public view returns (string memory)"
]

const KOI_CHAIN_ID = 701
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface SubnameRegistrationProps {
  onSubnameRegistered: () => void;
}

const SubnameRegistration: React.FC<SubnameRegistrationProps> = ({ onSubnameRegistered }) => {
  const [subname, setSubname] = useState('')
  const [status, setStatus] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [registeredSubname, setRegisteredSubname] = useState('')
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  useEffect(() => {
    if (isConnected) {
      checkNetwork()
      fetchRegisteredSubname()
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      fetchRegisteredSubname()
    }
  }, [isConnected, isCorrectNetwork, walletAddress])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const checkNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        setIsCorrectNetwork(parseInt(chainId) === KOI_CHAIN_ID)
      } catch (error) {
        console.error('Error checking network:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setWalletAddress(accounts[0])
        setIsConnected(true)
        checkNetwork()
      } catch (error) {
        console.error('Error connecting wallet:', error)
        setStatus('Error connecting wallet. Please try again.')
      }
    } else {
      setStatus('Please install MetaMask to use this feature.')
    }
  }

  const fetchRegisteredSubname = async () => {
    if (typeof window.ethereum !== 'undefined' && isConnected && isCorrectNetwork) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS, DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI, provider)
        console.log('Fetching subname for address:', walletAddress)
        const subname = await contract.getSubnameForAddress(walletAddress)
        console.log('Fetched subname:', subname)
        setRegisteredSubname(subname)
      } catch (error) {
        console.error('Error fetching registered subname:', error)
      }
    } else {
      console.log('Cannot fetch subname: ', { 
        ethereum: typeof window.ethereum !== 'undefined', 
        isConnected, 
        isCorrectNetwork 
      })
    }
  }

  const registerSubname = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isCorrectNetwork) {
      setStatus('Please switch to the Koi network to register a subname.')
      return
    }
    setStatus('Processing...')

    try {
      if (typeof window.ethereum !== 'undefined' && isConnected) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS, DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI, signer)

        const tx = await contract.registerSubname(subname)
        await tx.wait()

        setStatus(`Subname "${subname}.darwinia.eth" registered successfully!`)
        setSubname('')
        fetchRegisteredSubname()
        onSubnameRegistered() // Call the callback function
      } else {
        setStatus('Please connect your wallet to register a subname.')
      }
    } catch (error) {
      console.error('Error details:', error)
      let errorMessage = 'An unknown error occurred. Please try again.'

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error)
      }

      if (errorMessage.includes('Subname is already registered')) {
        setStatus(`Error: Subname "${subname}.darwinia.eth" is already registered.`)
      } else if (errorMessage.includes('user rejected transaction')) {
        setStatus('Error: Transaction was rejected by the user.')
      } else {
        setStatus(`Error: ${errorMessage}`)
      }
    }
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

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  }

  console.log('Contract Address:', DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS)
  console.log('Contract ABI:', DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI)

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Register Darwinia Subname</h2>
      {!isConnected ? (
        <button onClick={connectWallet} style={buttonStyle}>Connect Wallet</button>
      ) : !isCorrectNetwork ? (
        <p style={{ color: 'red' }}>Please switch to the Koi network to use this application.</p>
      ) : (
        <div>
          <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          {registeredSubname ? (
            <p>Your registered subname: <strong>{registeredSubname}.darwinia.eth</strong></p>
          ) : (
            <p>You don't have a registered subname yet.</p>
          )}
          <form onSubmit={registerSubname}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input
                type="text"
                value={subname}
                onChange={(e) => setSubname(e.target.value)}
                placeholder="Enter subname"
                required
                style={inputStyle}
              />
              <span style={{ marginLeft: '5px' }}>.darwinia.eth</span>
            </div>
            <button type="submit" style={buttonStyle} disabled={!isConnected || !isCorrectNetwork}>Register</button>
          </form>
          {status && (
            <p style={{ 
              marginTop: '10px', 
              color: status.includes('Error') ? 'red' : 'green',
              wordBreak: 'break-word'
            }}>
              {status}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default SubnameRegistration