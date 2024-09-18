import React from 'react'
import SubnameRegistration from '../components/SubnameRegistration'
import SubnameQuery from '../components/SubnameQuery'

const Home: React.FC = () => {
  return (
    <div>
      <h1>Darwinia Subname Registry</h1>
      <SubnameRegistration />
      <SubnameQuery />
    </div>
  )
}

export default Home