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

interface SubnameManagementProps {
  refreshTrigger: number;
}

const SubnameManagement: React.FC<SubnameManagementProps> = ({ refreshTrigger }) => {
  const [subnames, setSubnames] = useState<Subname[]>([])

  useEffect(() => {
    fetchAllSubnames()
  }, [refreshTrigger]) // Add refreshTrigger to the dependency array

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

  const containerStyle: React.CSSProperties = {
    maxWidth: '600px', // Changed from 800px to 600px to match other components
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

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  }

  const thStyle: React.CSSProperties = {
    backgroundColor: '#f2f2f2',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  }

  const tdStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    wordBreak: 'break-all', // Added to handle long addresses
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Subname Management</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Subname</th>
            <th style={thStyle}>Owner</th>
          </tr>
        </thead>
        <tbody>
          {subnames.map((subname, index) => (
            <tr key={index}>
              <td style={tdStyle}>{subname.name}.darwinia.eth</td>
              <td style={tdStyle}>{subname.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SubnameManagement