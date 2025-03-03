import React from 'react'
import Routex from './utils/Routex'
import CustomNavbar from './components/CustomNavbar'
function App() {
  return (
    <>
        <div className='flex flex-col'> 
          <CustomNavbar />
            <div className="flex-0">
              <Routex />
            </div>
        </div>
    </>

     
  )
}

export default App