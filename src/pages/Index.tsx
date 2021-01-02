import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import ProductItem from '../components/products/ProductItem'
import Spinner from '../components/Spinner'
import Tab from '../components/Tab'
import Pagination from '../components/Pagination'
import { useAuthContext } from '../state/auth-context'
import { useModalContext } from '../state/modal-context'
import { useProductsContext } from '../state/products-context'
import { useSearchContext } from '../state/search-context'
import { useSelectTab } from '../hooks/useSelectTab'
import { usePagination } from '../hooks/usePagination'
import { Product, ProductTab } from '../types'
import { productTabs } from '../helpers'

export const prodTabType = 'cat'
export const productsPerPage = 6

interface Props {}

const Index: React.FC<Props> = () => {
  const { setModalType } = useModalContext()
  const {
    authState: { authUser, signoutRedirect },
  } = useAuthContext()
  const {
    productsState: { products, loading, productCounts },
  } = useProductsContext()
  const { searchedItems } = useSearchContext()
  const { activeTab } = useSelectTab<ProductTab>(prodTabType, 'All')

  const [productsByCat, setProductsByCat] = useState(products[activeTab])

  const { page, totalPages } = usePagination<ProductTab, Product>(
    productCounts[activeTab],
    productsPerPage,
    activeTab,
    searchedItems as Product[]
  )

  const history = useHistory<{ from: string }>()
  const { state } = history.location

  useEffect(() => {
    // Open the signin modal after the user has been redirected from some private route
    if (!signoutRedirect) {
      if (state?.from) {
        if (!authUser) setModalType('signin')
        else history.push(state.from)
      }
    } else {
      history.replace('/', undefined)
    }
  }, [setModalType, state, authUser, history, signoutRedirect])

  // When the tab changed
  useEffect(() => {
    setProductsByCat(products[activeTab])
  }, [activeTab, products])

  if (loading) return <Spinner color='grey' width={50} height={50} />

  if (!loading && products.All.length === 0)
    return <h2 className='header--center'>No Products</h2>

  return (
    <div className='page--products'>
      <div className='products-category'>
        {productTabs.map((cat) => (
          <Tab
            key={cat}
            label={cat}
            tabType={prodTabType}
            activeTab={activeTab}
            withPagination={true}
          />
        ))}
      </div>

      <div className='pagination-container'>
        <Pagination
          page={page}
          totalPages={totalPages}
          tabType={prodTabType}
          activeTab={activeTab}
        />
      </div>

      <div className='products'>
        {searchedItems ? (
          <>
            {searchedItems.length < 1 ? (
              <h2 className='header--center'>No products found.</h2>
            ) : (
              (searchedItems as Product[]).map((product) => (
                <ProductItem key={product.id} product={product} />
              ))
            )}
          </>
        ) : (
          productsByCat.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}

export default Index
