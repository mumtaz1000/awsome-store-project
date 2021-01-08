import React, { useState, useEffect } from 'react'

import AdminProductItem from '../components/manage-products/AdminProductItem'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import AddAndEditProduct from '../components/manage-products/AddAndEditProduct'
import AlertDialog from '../components/dialogs/AlertDialog'
import Pagination from '../components/Pagination'
import { useProductsContext } from '../state/products-context'
import { useSearchContext } from '../state/search-context'
import { useManageProduct } from '../hooks/useManageProduct'
import { useDialog } from '../hooks/useDialog'
import { usePagination } from '../hooks/usePagination'
import { Product } from '../types'

const productsPerPage = 10

interface Props {}

const ManageProducts: React.FC<Props> = () => {
  const [openProductForm, setOpenProductForm] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const {
    productsState: {
      products,
      loading,
      error,
      productCounts,
      queryMoreProducts,
    },
  } = useProductsContext()
  const { searchedItems } = useSearchContext()
  const { openDialog, setOpenDialog } = useDialog()
  const {
    deleteProduct,
    loading: deleteProdLoading,
    error: deleteProdError,
  } = useManageProduct()
  const { page, totalPages } = usePagination(
    productCounts.All,
    productsPerPage,
    undefined,
    searchedItems as Product[]
  )

  const [productsByPage, setProductsByPage] = useState(products.All)
  const [paginatedSearchedItems, setPaginatedSearchedItems] = useState(
    searchedItems
  )

  useEffect(() => {
    const startIndex = productsPerPage * (page - 1)
    const endIndex = productsPerPage * page

    if (searchedItems) {
      setPaginatedSearchedItems(searchedItems.slice(startIndex, endIndex))
      setProductsByPage([])
    } else {
      // Check if we need to query more products
      if (
        products.All.length < productCounts.All &&
        products.All.length < productsPerPage * page
      ) {
        queryMoreProducts()
        return
      }

      setProductsByPage(products.All.slice(startIndex, endIndex))
      setPaginatedSearchedItems(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.All, productCounts.All, page, searchedItems])

  if (loading) return <Spinner color='grey' width={50} height={50} />

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

      {totalPages > 0 && (
        <div className='pagination-container'>
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}

      <div className='manage-products__section'>
        {!loading && products.All.length === 0 ? (
          <h2 className='header--center'>No products, let's add one.</h2>
        ) : (
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
              {paginatedSearchedItems ? (
                <>
                  {paginatedSearchedItems.length < 1 ? (
                    <tr>
                      <td colSpan={6}>
                        <h2 className='header--center'>No products found.</h2>
                      </td>
                    </tr>
                  ) : (
                    (paginatedSearchedItems as Product[]).map((product) => (
                      <AdminProductItem
                        key={product.id}
                        product={product}
                        setOpenProductForm={setOpenProductForm}
                        setProductToEdit={setProductToEdit}
                        setOpenDialog={setOpenDialog}
                        setProductToDelete={setProductToDelete}
                      />
                    ))
                  )}
                </>
              ) : (
                productsByPage &&
                productsByPage.map((product) => (
                  <AdminProductItem
                    key={product.id}
                    product={product}
                    setOpenProductForm={setOpenProductForm}
                    setProductToEdit={setProductToEdit}
                    setOpenDialog={setOpenDialog}
                    setProductToDelete={setProductToDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {error && <p className='paragraph paragraph--error'>{error}</p>}

      {openDialog && (
        <AlertDialog
          header='Please confirm'
          message={`Are you sure you want to delete this ${
            productToDelete ? productToDelete?.title : 'item'
          }?`}
          onCancel={() => {
            setProductToDelete(null)
            setOpenDialog(false)
          }}
          onConfirm={async () => {
            if (productToDelete) {
              const finished = await deleteProduct(productToDelete)

              if (finished) setOpenDialog(false)
            }
          }}
          loading={deleteProdLoading}
          error={deleteProdError}
        />
      )}
    </div>
  )
}

export default ManageProducts
