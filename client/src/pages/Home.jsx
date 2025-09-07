import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'

function Home() {
  const [isBillingModalOpen, setIsbillingmodalopen] = useState(false)
  return (
    <div className='bg-black'>
     <Navbar isBillingModalOpen={isBillingModalOpen}/>
      <Hero setIsbillingmodalopen={setIsbillingmodalopen} />
    </div>
  )
}

export default Home
