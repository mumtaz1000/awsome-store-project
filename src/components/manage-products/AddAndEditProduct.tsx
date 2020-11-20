import React from 'react'
import { useForm, Controller } from 'react-hook-form'

import Input from '../Input'
import Button from '../Button'

interface Props {
  setOpenProductForm: (open: boolean) => void
}

const AddAndEditProduct: React.FC<Props> = ({ setOpenProductForm }) => {
  const { control } = useForm<any>()

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
          {/* Titile */}
          <Controller
            name='title'
            control={control}
            defaultValue=''
            render={() => <Input label='Title' placeholder='Product title' />}
          />

          {/* Description */}
          <Controller
            name='description'
            control={control}
            defaultValue=''
            render={() => (
              <Input label='Description' placeholder='Product description' />
            )}
          />

          {/* Price */}
          <Controller
            name='price'
            control={control}
            defaultValue=''
            render={() => <Input label='Price' placeholder='Product price' />}
          />

          {/* Image */}

          {/* Category */}

          {/* Intentory */}
          <Controller
            name='inventory'
            control={control}
            defaultValue=''
            render={() => (
              <Input
                type='number'
                label='Inventory'
                placeholder='Product inventory'
              />
            )}
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
