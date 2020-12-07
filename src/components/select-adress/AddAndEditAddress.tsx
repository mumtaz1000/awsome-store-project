import React from 'react'

import Input from '../Input'

interface Props {}

const AddAndEditAddress: React.FC<Props> = () => {
  return (
    <form className='form'>
      <Input label='Fullname' name='fullname' placeholder='Full name' />
      <Input label='Address1' name='address1' placeholder='Adress 1' />
      <Input label='Address2' name='address2' placeholder='Address 2' />
      <Input label='City' name='city' placeholder='City' />
      <Input label='Zipcode' name='zipcode' placeholder='Zip code' />
      <Input label='Phone' name='phone' placeholder='Phone' />
    </form>
  )
}

export default AddAndEditAddress
