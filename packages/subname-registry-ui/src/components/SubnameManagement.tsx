import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS = '0xf6B8A7C7B82E3Bb3551393931d71987908bF486f'
const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI = [
  "function owner() public view returns (address)",
  "function getSubnameOwner(string) public view returns (address)",
  "function getAllSubnames() public view returns (string[] memory)",
  "function getSubnameCount() public view returns (uint256)"
]

interface Subname {
  name: string;
  owner: string;
}

const SubnameManagement: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [subnames, setSubnames] = useState<Subname[]>([])
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    console.log("Checking wallet connection");
    checkWalletConnection()
  }, [])

  useEffect(() => {
    if (isConnected) {
      console.log("Wallet connected, checking admin status");
      checkAdminStatus()
    }
  }, [isConnected])

  useEffect(() => {
    if (isAdmin) {
      console.log("Admin status confirmed, fetching subnames");
      fetchAllSubnames()
    }
  }, [isAdmin])

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
    console.log("Wallet connection status:", isConnected);
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
    console.log("Admin status:", isAdmin);
  }

  const fetchAllSubnames = async () => {
    if (typeof window.ethereum !== 'undefined' && isConnected && isAdmin) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS, DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI, provider)
        
        console.log("Fetching all subnames...");
        const allSubnames = await contract.getAllSubnames()
        console.log("All subnames:", allSubnames);
        
        const subnameDetails = await Promise.all(allSubnames.map(async (subname: string) => {
          const owner = await contract.getSubnameOwner(subname)
          return { name: subname, owner }
        }))
        
        console.log("Subname details:", subnameDetails);
        setSubnames(subnameDetails)
      } catch (error) {
        console.error('Error fetching subnames:', error)
      }
    }
  }

  if (!isConnected) {
    return <p>Please connect your wallet to access subname management.</p>
  }

  if (!isAdmin) {
    return <p>You do not have admin access to manage subnames.</p>
  }

  return (
    <div>
      <h2>Subname Management</h2>
      <table>
        <thead>
          <tr>
            <th>Subname</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {subnames.map((subname, index) => (
            <tr key={index}>
              <td>{subname.name}.darwinia.eth</td>
              <td>{subname.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SubnameManagement