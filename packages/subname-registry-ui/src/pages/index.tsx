import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import SubnameRegistration from '../components/SubnameRegistration'
import SubnameQuery from '../components/SubnameQuery'
import SubnameManagement from '../components/SubnameManagement'

const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS = '0xf6B8A7C7B82E3Bb3551393931d71987908bF486f'
const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI = [
  "function owner() public view returns (address)"
]

const Home: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          checkAdminStatus(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const checkAdminStatus = async (address: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS, DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI, provider)
      const ownerAddress = await contract.owner()
      setIsAdmin(ownerAddress.toLowerCase() === address.toLowerCase())
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }

  return (
    <div>
      <h1>Darwinia Subname Registry</h1>
      <SubnameRegistration />
      <SubnameQuery />
      <SubnameManagement />
    </div>
  )
}

export default Home