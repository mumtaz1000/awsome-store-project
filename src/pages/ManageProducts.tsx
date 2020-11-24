import React, { useState } from 'react'

import Button from '../components/Button'
import AddAndEditProduct from '../components/manage-products/AddAndEditProduct'
import { UserInfo } from '../types'

interface Props {
  admin: UserInfo | null
}

const ManageProducts: React.FC<Props> = ({ admin }) => {
  const [openProductForm, setOpenProductForm] = useState(false)

  return (
    <div className='page--manage-products'>
      <div className='manage-products__section'>
        <Button
          className='btn--orange'
          width='12rem'
          onClick={() => setOpenProductForm(true)}
        >
          Add new product
        </Button>

        {openProductForm && (
          <AddAndEditProduct
            admin={admin}
            setOpenProductForm={setOpenProductForm}
          />
        )}
      </div>

      <div className='manage-products__section'></div>
    </div>
  )
}

export default ManageProducts
