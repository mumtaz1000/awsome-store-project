import React from 'react'
import { NavLink } from 'react-router-dom'

import Button from '../Button'
import { useAuthContext } from '../../state/auth-context'

interface Props {}

const Sidebar: React.FC<Props> = () => {
  const {
    authState: { authUser },
  } = useAuthContext()

  return (
    <div className='page page--sidebar'>
      <div className='backdrop'></div>
      <div className='sidebar sidebar-show'>
        <div className='sidebar__section sidebar__section--profile'>
          <h3 className='header--center header--sidebar'>
            {authUser?.displayName}
          </h3>
          <h3 className='header--center header--sidebar'>{authUser?.email}</h3>
        </div>

        {/* Client user */}
        <div className='sidebar__section sidebar__section--nav'>
          <li className='list'>
            <NavLink to='/product' className='list-link'>
              PRODUCTS
            </NavLink>
          </li>
          <li className='list'>
            <NavLink to='/buy/my-cart' className='list-link'>
              MY CART
            </NavLink>
          </li>
          <li className='list'>
            <NavLink to='/orders/my-orders' className='list-link'>
              MY ORDERS
            </NavLink>
          </li>
        </div>

        {/* Admin user */}
        {/* <div className='sidebar__section'></div>
        <div className='sidebar__section'></div> */}

        {/* Logout */}
        <div className='sidebar__section'>
          <Button className='btn--sidebar-signout'>Sign out</Button>
        </div>

        {/* Close sidebar */}
        <div className='sidebar__section'>
          <Button className='sidebar__close'>&times;</Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
