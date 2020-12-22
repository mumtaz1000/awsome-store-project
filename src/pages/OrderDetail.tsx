import React from 'react'
import { useParams } from 'react-router-dom'

interface Props {}

const OrderDetail: React.FC<Props> = () => {
  const params = useParams<{ id: string }>()

  return <div>{params.id}</div>
}

export default OrderDetail
