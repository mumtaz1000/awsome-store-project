import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Product, products } from '../data/products'

interface Props {}

const ProductDetail: React.FC<Props> = () => {
  const params = useParams() as { productId: string }

  const [product, setProduct] = useState<Product | undefined>()

  useEffect(() => {
    const prod = products.find((item) => item.id === params.productId)

    if (prod) setProduct(prod)
    else setProduct(undefined)
  }, [params])

  console.log(product)
  return <div>ProductDetail</div>
}

export default ProductDetail
