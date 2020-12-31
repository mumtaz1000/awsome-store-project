import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import ProductItem from '../components/products/ProductItem'
import Spinner from '../components/Spinner'
import { useAuthContext } from '../state/auth-context'
import { useModalContext } from '../state/modal-context'
import { useProductsContext } from '../state/products-context'
import {useSearchContext} from '../state/search-context'
import { Product } from '../types'

interface Props {}

const Index: React.FC<Props> = () => {
  const { setModalType } = useModalContext()
  const {
    authState: { authUser, signoutRedirect },
  } = useAuthContext()
  const {
    productsState: { products, loading },
  } = useProductsContext()
  const {searchedItems} = useSearchContext()

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

  if (loading) return <Spinner color='grey' width={50} height={50} />

  if (!loading && products.All.length === 0)
    return <h2 className='header--center'>No Products</h2>

  return (
    <div className='page--products'>
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
          products.All.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}

export default Index
