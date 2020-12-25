import React from 'react'

import { useFetchUsers } from '../hooks/useFetchUsers'
import { UserInfo } from '../types'

interface Props {
  userInfo: UserInfo
}

const ManageUsers: React.FC<Props> = ({ userInfo }) => {
  const { users, userCounts, loading, error } = useFetchUsers(userInfo)

  return <div>ManageUsers</div>
}

export default ManageUsers
