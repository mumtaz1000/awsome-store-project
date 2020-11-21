import React from 'react'
import { useForm } from 'react-hook-form'

import Input from '../Input'
import Button from '../Button'
import { Product } from '../../types'

interface Props {
  setOpenProductForm: (open: boolean) => void
}

const AddAndEditProduct: React.FC<Props> = ({ setOpenProductForm }) => {
  const { register, handleSubmit, errors } = useForm<
    Pick<Product, 'title' | 'description' | 'price' | 'category' | 'inventory'>
  >()

  const handleAddProduct = handleSubmit((data) => {
    console.log(data)
  })

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

        <form className='form' onSubmit={handleAddProduct}>
          {/* Title */}
          <Input
            label='Title'
            name='title'
            placeholder='Product title'
            ref={register({
              required: 'Titile is requried.',
              minLength: {
                value: 3,
                message: 'Product title must be at least 3 characters.',
              },
            })}
            error={errors.title?.message}
          />

          {/* Description */}
          <Input
            label='Description'
            name='description'
            placeholder='Product description'
            ref={register({
              required: 'Description is requried.',
              minLength: {
                value: 6,
                message: 'Product description must be at least 6 characters.',
              },
              maxLength: {
                value: 200,
                message:
                  'Product description must be not more than 200 characters.',
              },
            })}
            error={errors.description?.message}
          />

          {/* Price */}
          <Input
            label='Price'
            type='number'
            name='price'
            placeholder='Product price'
            ref={register({
              required: 'Price is requried.',
              min: {
                value: 1,
                message: 'Product price must have at least $1.',
              },
            })}
            error={errors.price?.message}
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
            ref={register({
              required: 'Inventory is requried.',
              min: 0,
              pattern: {
                value: /^[0-9]\d*$/,
                message: 'Inventory must be the positive whole number.',
              },
            })}
            error={errors.inventory?.message}
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
