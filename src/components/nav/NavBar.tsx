import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../Button'
import { useAuthContext } from '../../state/auth-context'
import { useModalContext } from '../../state/modal-context'

interface Props {}

const NavBar: React.FC<Props> = () => {
  const {
    authState: { authUser },
  } = useAuthContext()
  const { setModalType } = useModalContext()

  return (
    <header className='head'>
      <div className='head__section'>
        <div className='head__logo'>
          <NavLink to='/'>
            <h2 className='header header--logo'>AwesomeShop</h2>
          </NavLink>
        </div>

        <div className='head__search'>
          <div className='search-input'>
            <input type='text' className='search' placeholder='Search' />
          </div>
          <Button className='btn--search'>SEARCH</Button>
        </div>

        <nav className='head__navbar'>
          <ul className='navbar'>
            {authUser && (
              <div className='navbar__lists'>
                <li className='list list--cart'>
                  <NavLink to='/buy/my-cart'>
                    <FontAwesomeIcon
                      icon={['fas', 'cart-arrow-down']}
                      color='white'
                      size='lg'
                    />
                  </NavLink>
                  <div className='cart-qty'>0</div>
                </li>
              </div>
            )}

            <div className='navbar__profile'>
              {!authUser ? (
                <>
                  <Button className='btn--sign'>Sign in</Button>
                  <Button
                    className='btn--sign'
                    onClick={() => setModalType('signup')}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <div className='profile'>
                  <FontAwesomeIcon
                    icon={['fas', 'user-circle']}
                    color='white'
                    size='2x'
                  />
                </div>
              )}
            </div>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default NavBar
