import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../Button'
import LoggedOutNav from './LoggedOutNav'
import LoggedInNav from './LoggedInNav'
import { useAuthContext } from '../../state/auth-context'
import { useSearchContext } from '../../state/search-context'
import { useSearchItems } from '../../hooks/useSearchItems'

interface Props {}

const MainNav: React.FC<Props> = () => {
  const {
    authState: { authUser },
  } = useAuthContext()
  const { setSearchedItems } = useSearchContext()

  const [searchString, setSearchString] = useState('')

  const location = useLocation()

  const { searchItems, loading, error } = useSearchItems(location.pathname)

  useEffect(() => {
    if (!searchString) setSearchedItems(null)
  }, [searchString, setSearchedItems])

  useEffect(() => {
    if (error) alert(error)
  }, [error])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchString(e.target.value)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      return handleSearch()
    }
  }

  const handleSearch = async () => {
    if (!searchString) return

    return searchItems(searchString)
  }

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
            <input
              type='text'
              className='search'
              placeholder='Search'
              value={searchString}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />

            {searchString && (
              <FontAwesomeIcon
                icon={['fas', 'times']}
                size='lg'
                color='grey'
                className='clear-search'
                onClick={() => {
                  setSearchString('')
                  setSearchedItems(null)
                }}
              />
            )}
          </div>
          <Button
            className='btn--search'
            loading={loading}
            disabled={loading}
            onClick={handleSearch}
          >
            SEARCH
          </Button>
        </div>

        <nav className='head__navbar'>
          {!authUser ? <LoggedOutNav /> : <LoggedInNav />}
        </nav>
      </div>
    </header>
  )
}

export default MainNav
