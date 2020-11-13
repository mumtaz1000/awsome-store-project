import React from 'react'

import MainNav from './components/nav/MainNav'
// import Sidebar from './components/nav/Sidebar'
import { useModalContext } from './state/modal-context'

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  const { modal } = useModalContext()

  return (
    <div>
      <MainNav />
      {/* <Sidebar /> */}
      <div className='page'>{children}</div>

      {modal && modal}
    </div>
  )
}

export default Layout
