import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS = '0xf6B8A7C7B82E3Bb3551393931d71987908bF486f'
const DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI = [
  "function getAllSubnames() public view returns (string[] memory)",
  "function getSubnameOwner(string) public view returns (address)"
]

interface Subname {
  name: string;
  owner: string;
}

const SubnameManagement: React.FC = () => {
  const [subnames, setSubnames] = useState<Subname[]>([])

  useEffect(() => {
    fetchAllSubnames()
  }, [])

  const fetchAllSubnames = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(DARWINIA_SUBNAME_REGISTRY_CONTRACT_ADDRESS, DARWINIA_SUBNAME_REGISTRY_CONTRACT_ABI, provider)
      
      const allSubnames = await contract.getAllSubnames()
      const subnameDetails = await Promise.all(allSubnames.map(async (subname: string) => {
        const owner = await contract.getSubnameOwner(subname)
        return { name: subname, owner }
      }))
      
      setSubnames(subnameDetails)
    } catch (error) {
      console.error('Error fetching subnames:', error)
    }
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