import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import MyCart from '../pages/MyCart'
import SelectAddress from '../pages/SelectAddress'
import Checkout from '../pages/Checkout'
import PageNotFound from '../pages/PageNotFound'
import { Role } from '../types'
import { isClient } from '../helpers'

interface Props {}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!)

const BuyRoutes: React.FC<Props> = (props) => {
  const { userRole } = props as { userRole: Role | null }

  if (!isClient(userRole)) return <Redirect to='/' />

  return (
    <Elements stripe={stripePromise}>
      <Switch>
        <Route path='/buy/my-cart'>
          <MyCart />
        </Route>
        <Route path='/buy/select-address'>
          <SelectAddress />
        </Route>
        <Route path='/buy/checkout'>
          <Checkout />
        </Route>
        <Route path='*'>
          <PageNotFound />
        </Route>
      </Switch>
    </Elements>
  )
}

export default BuyRoutes
