import React from 'react'

import ShippingAddress from '../components/select-address/ShippingAddress'
import AddAndEditAddress from '../components/select-address/AddAndEditAddress'
import { useAuthContext } from '../state/auth-context'

interface Props {}

const SelectAddress: React.FC<Props> = () => {
  const {
    authState: { userInfo },
  } = useAuthContext()

  return (
    <div className='page--select-address'>
      <h2 className='header'>Select a shipping address</h2>

      <div className='select-address'>
        <div className='select-address__existing'>
          {userInfo?.shippingAddresses?.length &&
            userInfo.shippingAddresses.map((address) => (
              <ShippingAddress address={address} />
            ))}
        </div>

        <div className='select-address__add-new'>
          <h3 className='header'>Add a new address</h3>

          <AddAndEditAddress userInfo={userInfo} />
        </div>
      </div>
    </div>
  )
}

export default SelectAddress
