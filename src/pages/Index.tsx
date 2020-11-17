import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import ProductItem from '../components/products/ProductItem'
import { useAuthContext } from '../state/auth-context'
import { useModalContext } from '../state/modal-context'
import { products } from '../data/products'

interface Props {}

const Index: React.FC<Props> = () => {
  const { setModalType } = useModalContext()
  const {
    authState: { authUser },
  } = useAuthContext()
  const { state } = useLocation<{ from: string }>()
  const history = useHistory()

  useEffect(() => {
    // Open the signin modal after the user has been redirected from some private route
    if (state?.from) {
      if (!authUser) setModalType('signin')
      else history.push(state.from)
    }
  }, [setModalType, state, authUser, history])

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
