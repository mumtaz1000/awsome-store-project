import React, { useState } from 'react'

import AdminProductItem from '../components/manage-products/AdminProductItem'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import AddAndEditProduct from '../components/manage-products/AddAndEditProduct'
import { useProductsContext } from '../state/products-context'
import { Product } from '../types'

interface Props {}

const ManageProducts: React.FC<Props> = () => {
  const [openProductForm, setOpenProductForm] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const {
    productsState: { products, loading },
  } = useProductsContext()

  if (loading) return <Spinner color='grey' width={50} height={50} />

  if (!loading && products.All.length === 0)
    return <h2 className='header--center'>No products</h2>

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
            setOpenProductForm={setOpenProductForm}
            productToEdit={productToEdit}
            setProductToEdit={setProductToEdit}
          />
        )}
      </div>

      <div className='manage-products__section'>
        <table className='table'>
          <thead>
            <tr>
              <th className='table-cell'>Title</th>
              <th className='table-cell'>Image</th>
              <th className='table-cell'>Price ($)</th>
              <th className='table-cell table-cell--hide'>Created At</th>
              <th className='table-cell table-cell--hide'>Updated At</th>
              <th className='table-cell'>Inventory</th>
            </tr>
          </thead>

          <tbody>
            {products.All.map((product) => (
              <AdminProductItem
                key={product.id}
                product={product}
                setOpenProductForm={setOpenProductForm}
                setProductToEdit={setProductToEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageProducts
