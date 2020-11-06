import React from 'react'

import NavBar from './components/nav/NavBar'
import Signup from './components/auth/Signup'

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <NavBar />

      <div className='page'>{children}</div>

      <Signup />
    </div>
  )
}

export default Layout
