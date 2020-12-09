import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../Button'
import { Address } from '../../types'

interface Props {
  address: Address
  setAddressToEdit: (address: Address | null) => void
}

const ShippingAddress: React.FC<Props> = ({ address, setAddressToEdit }) => {
  const { fullname, address1, address2, city, zipCode, phone } = address

  return (
    <div className='shipping-address'>
      <div className='shipping-address__detail'>
        <h4 className='header'>{fullname}</h4>
        <p className='paragraph'>{address1}</p>
        {address2 && <p className='paragraph'>{address2}</p>}
        <p className='paragraph'>{city}</p>
        <p className='paragraph'>{zipCode}</p>
        <p className='paragraph'>{phone}</p>
      </div>

      <Button width='100%' className='btn--orange' style={{ margin: '1rem 0' }}>
        Deliver to this address
      </Button>

      <div className='shipping-address__edit'>
        <FontAwesomeIcon
          icon={['fas', 'edit']}
          size='1x'
          style={{ cursor: 'pointer' }}
          onClick={() => setAddressToEdit(address)}
        />

        <FontAwesomeIcon
          icon={['fas', 'trash-alt']}
          size='1x'
          color='red'
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}

export default ShippingAddress
