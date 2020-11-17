import React from 'react'
import { Redirect } from 'react-router-dom'

import { useAuthContext } from '../state/auth-context'

interface Props {}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const {
    authState: { authUser },
  } = useAuthContext()

  if (!authUser) return <Redirect to='/' />

  return <>{children}</>
}

export default PrivateRoute
