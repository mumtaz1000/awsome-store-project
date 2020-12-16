import React, { useState, useEffect, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StripeCardElementChangeEvent } from '@stripe/stripe-js'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'

import Button from '../components/Button'
import Spinner from '../components/Spinner'
import { useCartContext } from '../state/cart-context'
import { useAuthContext } from '../state/auth-context'
import { useCheckout } from '../hooks/useCheckout'
import { useFetchCards } from '../hooks/useFetchCards'
import { Address, CreatePaymentIntentData, CreatePaymentMethod } from '../types'
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
  const [address, setAddress] = useState<Address | null>(null)
  const [loadAddress, setLoadAddress] = useState(true)

  const { cart } = useCartContext()
  const {
    authState: { userInfo },
  } = useAuthContext()
  const {
    completePayment,
    createStripeCustomerId,
    loading,
    error,
  } = useCheckout()
  const {
    userCards,
    stripeCustomer,
    loading: fetchCardsLoading,
    error: fetchCardsError,
    fetchCards,
  } = useFetchCards(userInfo)

  const elements = useElements()
  const stripe = useStripe()

  const btnRef = useRef<HTMLButtonElement>(null)

  const { register, errors, handleSubmit } = useForm<{
    cardName: string
    save?: boolean
    setDefault?: boolean
  }>()

  useEffect(() => {
    const addressData = window.localStorage.getItem('awesome_shippingAddress')

    if (!addressData) {
      setLoadAddress(false)
      return
    }

    const address = JSON.parse(addressData)
    setAddress(address)
    setLoadAddress(false)
  }, [setAddress, setLoadAddress])

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

  const handleCompletePayment = handleSubmit(async (data) => {
    if (!elements || !orderSummary || !stripe || !userInfo) return

    if (useNewCard) {
      // A. New Card
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) return

      if (typeof data.save === 'boolean') {
        // A.1 New card, not save
        // 1. Prepare a create payemnt intent data to get a client secret
        const createPaymentIntentData: CreatePaymentIntentData = {
          amount: orderSummary.amount,
        }

        // 2. Prepare a payment method to complete the payment
        const payment_method: CreatePaymentMethod = {
          card: cardElement,
          billing_details: { name: data.cardName },
        }

        if (data.save) {
          // A.2 New card, save
          if (!userInfo.stripeCustomerId) {
            // 1. User doesn't have a stripe customer id yet, create a new stripe customer.
            const stripeCustomerId = await createStripeCustomerId()

            createPaymentIntentData.customer = stripeCustomerId
          } else {
            // 2. User already has, use the existing one
            createPaymentIntentData.customer = userInfo.stripeCustomerId
          }
        }

        const finished = await completePayment(
          { createPaymentIntentData, stripe, payment_method },
          {
            save: data.save,
            setDefault: data.setDefault,
            customerId: createPaymentIntentData.customer,
          }
        )

        if (finished) {
          alert('Succeeded.')
        }
      }
    }

    // B. Save Card
  })

  if (loadAddress) return <Spinner color='grey' height={50} width={50} />

  if (!address) return <Redirect to='/buy/select-address' />

  const { fullname, address1, address2, city, zipCode, phone } = address

  return (
    <div className='page--checkout'>
      <div className='payment'>
        <h2 className='header'>Select a payment card</h2>

        {fetchCardsLoading ? (
          <Spinner color='grey' height={30} width={30} />
        ) : (
          <form className='form' onSubmit={handleCompletePayment}>
            {userCards?.data &&
              userCards.data.length > 0 &&
              userCards.data.map((method) => (
                <label key={method.id} className='card' htmlFor={method.id}>
                  <input
                    type='radio'
                    name='card'
                    value={method.id}
                    style={{ width: '10%' }}
                  />

                  <p className='paragraph' style={{ width: '40%' }}>
                    **** **** **** {method.card?.last4}
                  </p>

                  <p className='paragraph' style={{ width: '10%' }}>
                    {method.card?.brand === 'visa' ? (
                      <FontAwesomeIcon
                        icon={['fab', 'cc-visa']}
                        size='2x'
                        color='#206CAB'
                      />
                    ) : method.card?.brand === 'mastercard' ? (
                      <FontAwesomeIcon
                        icon={['fab', 'cc-mastercard']}
                        size='2x'
                        color='#EB2230'
                      />
                    ) : method.card?.brand === 'amex' ? (
                      <FontAwesomeIcon
                        icon={['fab', 'cc-amex']}
                        size='2x'
                        color='#099DD9'
                      />
                    ) : (
                      method.card?.brand
                    )}
                  </p>

                  <div style={{ width: '30%' }}>
                    {method.id ===
                    stripeCustomer?.invoice_settings.default_payment_method ? (
                      <p className='paragraph--center paragraph--focus'>
                        Default
                      </p>
                    ) : (
                      <div>
                        <input type='checkbox' name='setDefault' />
                        <label
                          htmlFor='setDefault'
                          className='set-default-card'
                        >
                          Set as default
                        </label>
                      </div>
                    )}
                  </div>

                  <p className='paragraph' style={{ width: '10%' }}>
                    <FontAwesomeIcon
                      icon={['fas', 'trash-alt']}
                      size='1x'
                      color='red'
                    />
                  </p>
                </label>
              ))}
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

              {error && <p className='paragraph paragraph--error'>{error}</p>}
            </div>

            <button ref={btnRef} style={{ display: 'none' }}></button>
          </form>
        )}

        {fetchCardsError && (
          <p className='paragraph paragraph--error'>{fetchCardsError}</p>
        )}
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
            disabled={!stripe || !useNewCard || disabled || loading}
            loading={loading}
          >
            Complete payment
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
