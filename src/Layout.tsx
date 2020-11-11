import React from 'react'

import NavBar from './components/nav/NavBar'
import { useModalContext } from './state/modal-context'

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  const { modal } = useModalContext()

  return (
    <div>
      <NavBar />

      <div className='page'>{children}</div>

      {modal && modal}
    </div>
  )
}

export default Layout
