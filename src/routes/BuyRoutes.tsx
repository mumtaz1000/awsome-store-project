import React from 'react'
import { Switch, Route } from 'react-router-dom'

import MyCart from '../pages/MyCart'
import SelectAddress from '../pages/SelectAddress'
import Checkout from '../pages/Checkout'
import PageNotFound from '../pages/PageNotFound'
import PrivateRoute from './PrivateRoute'

interface Props {}

const BuyRoutes: React.FC<Props> = () => {
  return (
    <PrivateRoute>
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
    </PrivateRoute>
  )
}

export default BuyRoutes
