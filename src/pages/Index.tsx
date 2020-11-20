import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import ProductItem from '../components/products/ProductItem'
import { useAuthContext } from '../state/auth-context'
import { useModalContext } from '../state/modal-context'
import { products } from '../data/products'

interface Props {}

const Index: React.FC<Props> = () => {
  const { setModalType } = useModalContext()
  const {
    authState: { authUser, signoutRedirect },
  } = useAuthContext()

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

  return (
    <div className='page--products'>
      <div className='products'>
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Index
