import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Orders from '../pages/Orders'
import OrderDetail from '../pages/OrderDetail'
import PageNotFound from '../pages/PageNotFound'

interface Props {}

const OrderRoutes: React.FC<Props> = () => {
  return (
    <Switch>
      <Route path='/orders/my-orders/:id'>
        <OrderDetail />
      </Route>
      <Route path='/orders/my-orders'>
        <Orders />
      </Route>
      <Route path='*'>
        <PageNotFound />
      </Route>
    </Switch>
  )
}

export default OrderRoutes
