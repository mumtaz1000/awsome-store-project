import React, { useState, useEffect, useRef } from 'react'
import { useHistory, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StripeCardElementChangeEvent } from '@stripe/stripe-js'
import { CardElement, useElements } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'

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
  const [useNewCard, setUseNewCard] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [newCardError, setNewCardError] = useState('')

  const { location } = useHistory<{ address: Address }>()
  const { state } = location

  const { cart } = useCartContext()

  const elements = useElements()

  const btnRef = useRef<HTMLButtonElement>(null)

  const { register, errors, handleSubmit } = useForm<{
    cardName: string
    save?: boolean
    setDefault?: boolean
  }>()

  useEffect(() => {
    if (cart && cart.length > 0)
      setOrderSummary({
        quantity: calculateCartQuantity(cart),
        amount: calculateCartAmount(cart),
      })
  }, [cart])

  const handleClickBtn = () => {
    if (btnRef && btnRef.current) btnRef.current.click()
  }

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    setDisabled(e.empty || !e.complete)
    setNewCardError(e.error ? e.error.message : '')

    if (e.complete) setNewCardError('')
  }

  const handleCompletePayment = handleSubmit((data) => {
    if (!elements) return

    const cardElement = elements.getElement(CardElement)
    console.log(data)
    console.log(cardElement)
  })

  if (!state?.address) return <Redirect to='/buy/select-address' />

  const { fullname, address1, address2, city, zipCode, phone } = state.address

  return (
    <div className='page--checkout'>
      <div className='payment'>
        <h2 className='header'>Select a payment card</h2>

        <form className='form' onSubmit={handleCompletePayment}>
          <div className='form--new-card'>
            <label htmlFor='newCard' className='card card--new'>
              <input
                type='radio'
                name='card'
                value='new-card'
                style={{ width: '10%' }}
                onClick={() => setUseNewCard(true)}
              />

              <h4
                className='paragraph paragraph--bold'
                style={{ width: '30%' }}
              >
                Use new card
              </h4>

              <p className='paragraph' style={{ width: '5%' }}>
                {' '}
              </p>

              <div className='new-card__logo' style={{ width: '45%' }}>
                <FontAwesomeIcon
                  icon={['fab', 'cc-visa']}
                  size='1x'
                  style={{ margin: '0 0.5rem' }}
                  color='#206CAB'
                />
                <FontAwesomeIcon
                  icon={['fab', 'cc-mastercard']}
                  size='1x'
                  style={{ margin: '0 0.5rem' }}
                  color='#EB2230'
                />
                <FontAwesomeIcon
                  icon={['fab', 'cc-amex']}
                  size='1x'
                  style={{ margin: '0 0.5rem' }}
                  color='#099DD9'
                />
              </div>

              <p className='paragraph' style={{ width: '10%' }}>
                {' '}
              </p>
            </label>

            <div className='new-card__form'>
              <div className='form__input-container form__input-container--card'>
                <input
                  type='text'
                  className='input input--card-name'
                  name='cardName'
                  placeholder='Name on card'
                  ref={register({ required: 'Card name is required.' })}
                />

                {errors.cardName && (
                  <p className='paragraph paragraph--small paragraph--error'>
                    {errors.cardName.message}
                  </p>
                )}
              </div>

              <div className='form__input-container form__input-container--card'>
                <CardElement
                  options={{
                    style: {
                      base: { color: 'blue', iconColor: 'blue' },
                      invalid: { color: 'red', iconColor: 'red' },
                    },
                  }}
                  onChange={handleCardChange}
                />

                {newCardError && (
                  <p className='paragraph paragraph--error'>{newCardError}</p>
                )}
              </div>

              <div className='form__set-new-card'>
                <div className='form__input-container'>
                  <input type='checkbox' name='save' ref={register} />
                  <label htmlFor='saveCard' className='paragraph'>
                    Save this card
                  </label>
                </div>

                <div className='form__input-container'>
                  <input type='checkbox' name='setDefault' ref={register} />
                  <label htmlFor='setDefault' className='paragraph'>
                    Set as default
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button ref={btnRef} style={{ display: 'none' }}></button>
        </form>
      </div>

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
          <Button
            width='100%'
            className='btn--orange btn--payment'
            onClick={handleClickBtn}
            disabled={!useNewCard || disabled}
          >
            Complete payment
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
