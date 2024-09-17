import type { NextPage } from 'next'
import SubnameRegistration from '../components/SubnameRegistration'

const Home: NextPage = () => {
  return (
    <div>
      <h1>Darwinia Subname Registry</h1>
      <SubnameRegistration />
    </div>
  )
}

export default Home