import React, { useState, useEffect } from 'react'

import Spinner from '../components/Spinner'
import ManageOrderItem from '../components/manage-orders/ManageOrderItem'
import Tab from '../components/Tab'
import { orderTabType } from './Orders'
import { useOrdersContext } from '../state/orders-context'
import { useSearchContext } from '../state/search-context'
import { useSelectTab } from '../hooks/useSelectTab'
import { Order, OrderTab } from '../types'
import { orderTabs } from '../helpers'

interface Props {}

const ManageOrders: React.FC<Props> = () => {
  const {
    ordersState: { orders, loading, error },
  } = useOrdersContext()
  const { searchedItems } = useSearchContext()

  const { activeTab } = useSelectTab<OrderTab>(orderTabType, 'New')

  const [ordersByTab, setOrdersByTab] = useState(
    orders ? orders.filter((order) => order.shipmentStatus === 'New') : null
  )

  useEffect(() => {
    if (!orders) {
      setOrdersByTab(null)
      return
    }

    if (activeTab === 'All') setOrdersByTab(orders)
    else
      setOrdersByTab(
        orders.filter((order) => order.shipmentStatus === activeTab)
      )
  }, [activeTab, orders, setOrdersByTab])

  if (loading) return <Spinner color='grey' height={50} width={50} />

  if (error) return <h2 className='header--center'>{error}</h2>

  if (!orders || orders.length === 0)
    return <h2 className='header--center'>Your have no orders.</h2>

  return (
    <div className='page--orders'>
      <div className='orders-header'>
        <h2 className='header header--orders'>Your orders</h2>

        <div className='orders-tabs'>
          {orderTabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              activeTab={activeTab}
              tabType={orderTabType}
            />
          ))}
        </div>
      </div>

      <div className='orders-details'>
        <div className='orders-content'>
          <div className='orders-column'>
            <h3 className='header--center'>Purchased date</h3>
          </div>
          <div className='orders-column orders-column--hide'>
            <h3 className='header--center'>Quantity</h3>
          </div>
          <div className='orders-column'>
            <h3 className='header--center'>Amount ($)</h3>
          </div>
          <div className='orders-column'>
            <h3 className='header--center'>Shipment status</h3>
          </div>
          <div className='orders-column orders-column--hide'>
            <h3 className='header--center'>Buyer</h3>
          </div>
          <div className='orders-column orders-column--manage'>
            <h3 className='header--center'>Manage order</h3>
          </div>
        </div>

        {/* Order */}
        {searchedItems ? (
          <>
            {searchedItems.length < 1 ? (
              <h2 className='header--center'>No orders found.</h2>
            ) : (
              (searchedItems as Order[]).map((order) => (
                <ManageOrderItem key={order.id} order={order} />
              ))
            )}
          </>
        ) : (
          ordersByTab &&
          ordersByTab.map((order) => (
            <ManageOrderItem key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  )
}

export default ManageOrders
