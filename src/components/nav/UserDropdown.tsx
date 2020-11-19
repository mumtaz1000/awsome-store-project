import React from 'react'

import Button from '../Button'
import ClientDropdown from './ClientDropdown'
import AdminDropdown from './AdminDropdown'
import {
  useAuthContext,
  openUserDropdown,
  signoutRedirect,
} from '../../state/auth-context'
import { useAuthenticate } from '../../hooks/useAuthenticate'
import { isAdmin, isClient } from '../../helpers'

interface Props {}

const UserDropdown: React.FC<Props> = () => {
  const {
    authState: { authUser, userRole },
    authDispatch,
  } = useAuthContext()
  const { signout } = useAuthenticate()

  return (
    <div className='page page--sidebar'>
      <div className='sidebar sidebar-show'>
        <div className='sidebar__section sidebar__section--profile'>
          <h3 className='header--center header--sidebar'>
            {authUser?.displayName}
          </h3>
          <h3 className='header--center header--sidebar'>{authUser?.email}</h3>
        </div>

        {/* Client user */}
        {isClient(userRole) && <ClientDropdown />}

        {/* Admin user */}
        {isAdmin(userRole) && <AdminDropdown />}

        {/* Logout */}
        <div className='sidebar__section'>
          <Button
            className='btn--sidebar-signout'
            onClick={() => {
              signout()
              authDispatch(signoutRedirect(true))
            }}
          >
            SIGN OUT
          </Button>
        </div>

        {/* Close sidebar */}
        <div className='sidebar__section'>
          <Button
            className='sidebar__close'
            onClick={() => authDispatch(openUserDropdown(false))}
          >
            &times;
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserDropdown
