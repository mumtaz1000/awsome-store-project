import React, { useState, useEffect } from 'react'
import { useHistory, Redirect } from 'react-router-dom'

import Button from '../components/Button'
import { useCartContext } from '../state/cart-context'
import { Address } from '../types'
import { calculateCartAmount, calculateCartQuantity } from '../helpers'

interface Props {}

const Checkout: React.FC<Props> = () => {
  const [orderSummary, setOrderSummary] = useState<{
    quantity: number
    amount: number
  }>()
  const { location } = useHistory<{ address: Address }>()
  const { state } = location

  const { cart } = useCartContext()

  useEffect(() => {
    if (cart && cart.length > 0)
      setOrderSummary({
        quantity: calculateCartQuantity(cart),
        amount: calculateCartAmount(cart),
      })
  }, [cart])

  if (!state?.address) return <Redirect to='/buy/select-address' />

  const { fullname, address1, address2, city, zipCode, phone } = state.address

  return (
    <div className='page--checkout'>
      <div className='payment'></div>

      <div className='summary'>
        {/* Shipping Address */}
        <div className='summary__section'>
          <h3 className='header'>Delivery address</h3>

          <p className='paragraph paragraph--focus'>{fullname}:</p>
          <p className='paragraph paragraph--focus'>{address1}</p>
          {address2 && <p className='paragraph paragraph--focus'>{address2}</p>}
          <p className='paragraph paragraph--focus'>
            {city}, {zipCode}
          </p>
          <p className='paragraph paragraph--focus'>Tel: {phone}</p>
        </div>

        {/* Order summary */}
        <div className='summary__section'>
          <h3 className='header'>Order summary</h3>

          <div className='order-summary'>
            <div>
              <p className='paragraph paragraph--focus'>Total quantity:</p>
              <p className='paragraph paragraph--focus'>Total amount:</p>
            </div>
            <div>
              <p className='paragraph paragraph--focus'>
                {orderSummary && orderSummary.quantity} pcs
              </p>
              <p className='paragraph paragraph--focus'>
                ${orderSummary && orderSummary.amount}
              </p>
            </div>
          </div>
        </div>

        <div className='summary__section'>
          <Button width='100%' className='btn--orange btn--payment'>
            Complete payment
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
