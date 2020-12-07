import React from 'react'
import { useForm } from 'react-hook-form'

import Input from '../Input'
import Button from '../Button'
import { useAddShippingAddress } from '../../hooks/useAddShippingAddress'
import { Address, UserInfo } from '../../types'

interface Props {
  userInfo: UserInfo | null
}

const AddAndEditAddress: React.FC<Props> = ({ userInfo }) => {
  const { addNewAddress, loading, error } = useAddShippingAddress()

  const { register, errors, handleSubmit, reset } = useForm<
    Omit<Address, 'index'>
  >()

  const handleAddNewAddress = handleSubmit(async (data) => {
    if (!userInfo) return

    const finished = await addNewAddress(data, userInfo)

    if (finished) reset()
  })

  return (
    <form
      className='form'
      onSubmit={handleAddNewAddress}
      style={{ width: '100%' }}
    >
      <Input
        label='Fullname'
        name='fullname'
        placeholder='Your full name'
        ref={register({ required: 'Full name is required.' })}
        error={errors.fullname?.message}
      />
      <Input
        label='Address1'
        name='address1'
        placeholder='Street address, P.O. box, company name'
        ref={register({
          required: 'Street address, P.O. box, company name are required.',
        })}
        error={errors.address1?.message}
      />
      <Input
        label='Address2'
        name='address2'
        placeholder='Apartment, suite, building, floor, etc.'
      />
      <Input
        label='City'
        name='city'
        placeholder='City'
        ref={register({
          required: 'City is required.',
        })}
        error={errors.city?.message}
      />
      <Input
        label='Zipcode'
        name='zipCode'
        placeholder='Zip code'
        ref={register({
          required: 'Zip code is required.',
        })}
        error={errors.zipCode?.message}
      />
      <Input
        label='Phone'
        name='phone'
        placeholder='Phone'
        ref={register({
          required: 'Phone is required.',
        })}
        error={errors.phone?.message}
      />

      <Button width='100%' loading={loading} disabled={loading}>
        Submit
      </Button>

      {error && <p className='paragraph paragraph--error'>{error}</p>}
    </form>
  )
}

export default AddAndEditAddress
