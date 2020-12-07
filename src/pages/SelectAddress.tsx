import React from 'react'

import AddAndEditAddress from '../components/select-adress/AddAndEditAddress'
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
        {userInfo?.shippingAddresses?.length && (
          <div className='select-address__existing'>
            <div>Shipping addressed go here</div>
          </div>
        )}

        <div className='select-address__add-new'>
          <h3 className='header'>Add a new address</h3>

          <AddAndEditAddress />
        </div>
      </div>
    </div>
  )
}

export default SelectAddress
