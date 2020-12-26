import React from 'react'

import Spinner from '../components/Spinner'
import User from '../components/manage-users/User'
import { useFetchUsers } from '../hooks/useFetchUsers'
import { UserInfo } from '../types'

interface Props {
  userInfo: UserInfo
}

const ManageUsers: React.FC<Props> = ({ userInfo }) => {
  const { users, userCounts, loading, error } = useFetchUsers(userInfo)

  if (loading) return <Spinner color='grey' height={50} width={50} />

  if (error) return <h2 className='header--center'>{error}</h2>

  if (!users || users.length === 0)
    return <h2 className='header--center'>No users.</h2>

  return (
    <div className='page--manage-users'>
      <h2 className='header--center'>Manage users</h2>

      <table className='table table--manage-users'>
        <thead>
          <tr>
            {/* Header */}
            <th className='table-cell' style={{ width: '20%' }} rowSpan={2}>
              Name
            </th>
            <th className='table-cell' style={{ width: '25%' }} rowSpan={2}>
              Email
            </th>
            <th className='table-cell' rowSpan={2}>
              Created At
            </th>

            <th className='table-cell' style={{ width: '25%' }} colSpan={3}>
              Role
            </th>
          </tr>

          {/* Sub header */}
          <tr>
            <th className='table-cell'>Client</th>
            <th className='table-cell'>Admin</th>
            <th className='table-cell'>Super</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <User key={user.id} user={user} admin={userInfo} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageUsers
