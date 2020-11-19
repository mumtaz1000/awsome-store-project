import React from 'react'
import { NavLink } from 'react-router-dom'

interface Props {}

const AdminDropdown: React.FC<Props> = () => {
  return (
    <>
      <div className='sidebar__section'>
        <h3 className='header--center header--orange header--link'>
          Switch to client view
        </h3>
      </div>
      <div className='sidebar__section sidebar__section--nav'>
        <li className='list'>
          <NavLink to='/admin/manage-products' className='list-link'>
            MANAGE PRODUCTS
          </NavLink>
        </li>
        <li className='list'>
          <NavLink to='/admin/manage-orders' className='list-link'>
            MANAGE ORDERS
          </NavLink>
        </li>
        <li className='list'>
          <NavLink to='/admin/manage-users' className='list-link'>
            MANAGE USERS
          </NavLink>
        </li>
      </div>
    </>
  )
}

export default AdminDropdown
