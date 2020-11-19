import React, { useState, useEffect, ReactElement } from 'react'
import { Redirect, useLocation } from 'react-router-dom'

import Spinner from '../components/Spinner'
import { useAuthContext } from '../state/auth-context'

interface Props {}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false)
  const {
    authState: { authUser, userRole },
  } = useAuthContext()

  const location = useLocation()

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setAuthChecked(true)
    }, 2000)

    return () => clearTimeout(checkAuth)
  }, [])

  if (!authChecked && (!authUser || !userRole))
    return <Spinner color='grey' height={50} width={50} />

  if (authChecked && (!authUser || !userRole))
    return (
      <Redirect
        to={{
          pathname: '/',
          state: {
            from: location.pathname,
          },
        }}
      />
    )

  return (
    <>
      {React.Children.map(children as ReactElement, (child) =>
        React.cloneElement(child, { userRole })
      )}
    </>
  )
}

export default PrivateRoute
