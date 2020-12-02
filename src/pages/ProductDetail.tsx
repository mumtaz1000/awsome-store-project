import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../components/Button'
import Spinner from '../components/Spinner'
import PageNotFound from './PageNotFound'
import { useAuthContext } from '../state/auth-context'
import { useModalContext } from '../state/modal-context'
import { useProductsContext } from '../state/products-context'
import { Product } from '../types'
import { formatAmount, isAdmin, isClient } from '../helpers'

interface Props {}

const ProductDetail: React.FC<Props> = () => {
  const {
    productsState: { products, loading },
  } = useProductsContext()
  const {
    authState: { authUser, userRole },
  } = useAuthContext()
  const { setModalType } = useModalContext()
  const [quantity, setQuantity] = useState(1)

  const params = useParams() as { productId: string }

  const [product, setProduct] = useState<Product | undefined>()

  useEffect(() => {
    const prod = products.All.find((item) => item.id === params.productId)

    if (prod) setProduct(prod)
    else setProduct(undefined)
  }, [params, products.All])

  if (loading) return <Spinner color='grey' width={50} height={50} />

  if (!product) return <PageNotFound />

  return (
    <div className='page--product-detail'>
      <div className='product-detail__section'>
        <img
          src={product.imageUrl}
          alt={product.title}
          className='product-image'
        />
      </div>

      <div className='product-detail__section'>
        <div className='product-detail__sub-section'>
          <h3 className='header'>{product.title}</h3>
          <p className='paragraph'>{product.description}</p>
        </div>
        <div className='product-detail__sub-section'>
          <p className='paragraph'>
            Price:{' '}
            <span className='paragraph--orange'>
              ${formatAmount(product.price)}
            </span>
          </p>
        </div>
        <div className='product-detail__sub-section product-detail__sub-section--stock'>
          <p className='paragraph'>
            Availability:{' '}
            <span
              className={`paragraph--success ${
                product.inventory === 0 ? 'paragraph--error' : undefined
              }`}
            >
              {product.inventory} pcs
            </span>
          </p>
        </div>

        {product.inventory === 0 ? (
          <p className='paragraph--error'>Out of stock</p>
        ) : (
          <div className='product-detail__sub-section quantity-control'>
            <div
              className='qty-action'
              style={{ cursor: quantity === 1 ? 'not-allowed' : undefined }}
              onClick={() =>
                setQuantity((prev) => {
                  if (prev < 2) return prev

                  return prev - 1
                })
              }
            >
              <FontAwesomeIcon icon={['fas', 'minus']} size='xs' color='grey' />
            </div>

            <div className='qty-action qty-action--qty'>
              <p className='paragraph'>{quantity}</p>
            </div>

            <div
              className='qty-action'
              style={{
                cursor:
                  quantity === product.inventory ? 'not-allowed' : undefined,
              }}
              onClick={() =>
                setQuantity((prev) => {
                  if (prev === product.inventory) return prev

                  return prev + 1
                })
              }
            >
              <FontAwesomeIcon icon={['fas', 'plus']} size='xs' color='grey' />
            </div>
          </div>
        )}

        <Button
          disabled={product.inventory === 0}
          onClick={() => {
            if (!authUser) {
              setModalType('signin')
              return
            } else if (authUser && isAdmin(userRole)) {
              alert('You are an admin user, you cannot proceed "Add To Cart".')
              return
            } else if (authUser && isClient(userRole)) {
              // Add The Product To Cart
            }
          }}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

export default ProductDetail
