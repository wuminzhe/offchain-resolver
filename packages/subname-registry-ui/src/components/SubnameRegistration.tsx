import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS = '0x07414d2B62A4Dd7fd1750C6DfBd9D38c250Cc573'
const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI = [
  "function registerSubname(string)",
  "function getSubnameForAddress(address addr) public view returns (string memory)"
]

const SubnameRegistration: React.FC = () => {
  const [subname, setSubname] = useState('')
  const [status, setStatus] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    checkWalletConnection()
  }, [])

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

  const registerSubname = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Processing...')

    try {
      if (typeof window.ethereum !== 'undefined' && isConnected) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, REGISTRY_CONTRACT_ABI, signer)

        const tx = await contract.registerSubname(subname)
        await tx.wait()

        setStatus(`Subname "${subname}" registered successfully!`)
        setSubname('')
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
        <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
      )}
      <form onSubmit={registerSubname}>
        <input
          type="text"
          value={subname}
          onChange={(e) => setSubname(e.target.value)}
          placeholder="Enter subname"
          required
        />
        <button type="submit" disabled={!isConnected}>Register</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}

export default SubnameRegistration