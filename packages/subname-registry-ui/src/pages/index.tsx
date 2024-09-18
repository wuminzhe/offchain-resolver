import React, { useState } from 'react'
import SubnameRegistration from '../components/SubnameRegistration'
import SubnameManagement from '../components/SubnameManagement'

const Home: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSubnameRegistered = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div>
      <SubnameRegistration onSubnameRegistered={handleSubnameRegistered} />
      <SubnameManagement refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default Home