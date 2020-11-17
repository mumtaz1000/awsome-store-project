import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import Spinner from '../components/Spinner'
import { useAuthContext } from '../state/auth-context'

interface Props {}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false)
  const {
    authState: { authUser },
  } = useAuthContext()

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setAuthChecked(true)
    }, 2000)

    return () => clearTimeout(checkAuth)
  }, [authUser])

  if (!authChecked && !authUser)
    return <Spinner color='grey' height={50} width={50} />

  if (authChecked && !authUser) return <Redirect to='/' />

  return <>{children}</>
}

export default PrivateRoute
