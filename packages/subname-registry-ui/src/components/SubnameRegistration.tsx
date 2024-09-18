import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import SubnameManagement from './SubnameManagement'

const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS = '0xf6B8A7C7B82E3Bb3551393931d71987908bF486f'
const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI = [
  "function registerSubname(string)",
  "function getSubnameForAddress(address addr) public view returns (string memory)",
  "function owner() public view returns (address)"
]

declare global {
  interface Window {
    ethereum?: any;
  }
}

const SubnameRegistration: React.FC = () => {
  const [subname, setSubname] = useState('')
  const [status, setStatus] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [registeredSubname, setRegisteredSubname] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  useEffect(() => {
    if (isConnected) {
      fetchRegisteredSubname()
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected) {
      checkAdminStatus()
    }
  }, [isConnected])

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

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setWalletAddress(accounts[0])
        setIsConnected(true)
      } catch (error) {
        console.error('Error connecting wallet:', error)
        setStatus('Error connecting wallet. Please try again.')
      }
    } else {
      setStatus('Please install MetaMask to use this feature.')
    }
  }

  const fetchRegisteredSubname = async () => {
    if (typeof window.ethereum !== 'undefined' && isConnected) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS, DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI, provider)
        const subname = await contract.getSubnameForAddress(walletAddress)
        setRegisteredSubname(subname)
      } catch (error) {
        console.error('Error fetching registered subname:', error)
      }
    }
  }

  const checkAdminStatus = async () => {
    if (typeof window.ethereum !== 'undefined' && isConnected) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS, DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI, provider)
        const ownerAddress = await contract.owner()
        const isAdminNow = ownerAddress.toLowerCase() === walletAddress.toLowerCase()
        console.log("Checking admin status:", { ownerAddress, walletAddress, isAdminNow });
        setIsAdmin(isAdminNow)
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      }
    }
  }

  const registerSubname = async (e: React.FormEvent) => {
    e.preventDefault()
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
      } else {
        setStatus('Please connect your wallet to register a subname.')
      }
    } catch (error) {
      console.error('Error:', error)
      setStatus('Error registering subname. Please try again.')
    }
  }

  return (
    <div>
      <h2>Register Darwinia Subname</h2>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          {registeredSubname ? (
            <p>Your registered subname: {registeredSubname}.darwinia.eth</p>
          ) : (
            <p>You don't have a registered subname yet.</p>
          )}
        </div>
      )}
      <form onSubmit={registerSubname}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={subname}
            onChange={(e) => setSubname(e.target.value)}
            placeholder="Enter subname"
            required
            style={{ marginRight: '5px' }}
          />
          <span>.darwinia.eth</span>&nbsp;&nbsp;
          <button type="submit" disabled={!isConnected}>Register</button>
        </div>
      </form>
      {status && <p>{status}</p>}
      
      {isAdmin && <SubnameManagement />}
    </div>
  )
}

export default SubnameRegistration