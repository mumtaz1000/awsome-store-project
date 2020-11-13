import React from 'react'

import MainNav from './components/nav/MainNav'
import UserDropdown from './components/nav/UserDropdown'
import { useModalContext } from './state/modal-context'

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  const { modal } = useModalContext()

  return (
    <div>
      <MainNav />
      <UserDropdown />
      <div className='page'>{children}</div>

      {modal && modal}
    </div>
  )
}

export default Layout
