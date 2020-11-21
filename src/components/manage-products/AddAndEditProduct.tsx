import React from 'react'

import Input from '../Input'
import Button from '../Button'

interface Props {
  setOpenProductForm: (open: boolean) => void
}

const AddAndEditProduct: React.FC<Props> = ({ setOpenProductForm }) => {
  return (
    <>
      <div className='backdrop' onClick={() => setOpenProductForm(false)}>
        {' '}
      </div>

      <div className='modal modal--add-product'>
        <div className='modal-close' onClick={() => setOpenProductForm(false)}>
          &times;
        </div>

        <h2 className='header--center'>Add A New Product</h2>

        <form className='form'>
          {/* Title */}
          <Input label='Title' name='title' placeholder='Product title' />

          {/* Description */}
          <Input
            label='Description'
            name='descripton'
            placeholder='Product descripton'
          />

          {/* Price */}
          <Input
            label='Price'
            type='number'
            name='price'
            placeholder='Product price'
          />

          {/* Image */}
          <Input label='Image' name='image' placeholder='Product image' />

          {/* Category */}
          <Input
            label='Category'
            name='category'
            placeholder='Product category'
          />

          {/* Inventory */}
          <Input
            label='Inventory'
            type='number'
            name='inventory'
            placeholder='Product inventory'
          />

          <Button
            className='btn--orange'
            width='100%'
            style={{ marginTop: '1rem' }}
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  )
}

export default AddAndEditProduct
