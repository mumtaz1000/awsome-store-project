import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react'

import { useAsyncCall } from '../hooks/useAsyncCall'
import { ProductTab, Product } from '../types'
import { productsRef, snapshotToDoc, productCountsRef } from '../firebase'

interface Props {}

// {
//   All: 3,
//   Clothing: 2,
//   Shoes: 1,
//   Watches: 0,
//   Accessories: 0,
// }

type Products = { [key in ProductTab]: Product[] }
type ProductCounts = { [key in ProductTab]: number }

type ProductsState = {
  products: Products
  productCounts: ProductCounts
  loading: boolean
  error: string
  searchedProducts: Product[] | null
}
type ProductsDispatch = {
  setProducts: Dispatch<SetStateAction<Products>>
  setSearchedProducts: Dispatch<SetStateAction<Product[] | null>>
}

const ProductsStateContext = createContext<ProductsState | undefined>(undefined)
const ProductsDispatchContext = createContext<ProductsDispatch | undefined>(
  undefined
)

const initialProducts: Products = {
  All: [],
  Clothing: [],
  Shoes: [],
  Watches: [],
  Accessories: [],
}

const initialProductCounts: ProductCounts = {
  All: 0,
  Clothing: 0,
  Shoes: 0,
  Watches: 0,
  Accessories: 0,
}

const ProductsContextProvider: React.FC<Props> = ({ children }) => {
  const { loading, setLoading, error, setError } = useAsyncCall()
  const [products, setProducts] = useState(initialProducts)
  const [productCounts, setProductCounts] = useState(initialProductCounts)
  const [searchedProducts, setSearchedProducts] = useState<Product[] | null>(
    null
  )

  // Fetch the products collection from firestore
  useEffect(() => {
    setLoading(true)

    const unsubscribe = productsRef.orderBy('createdAt', 'desc').onSnapshot({
      next: (snapshots) => {
        const allProducts: Product[] = []

        snapshots.forEach((snapshot) => {
          const product = snapshotToDoc<Product>(snapshot)

          allProducts.push(product)
        })

        const updatedProducts: any = {}

        Object.keys(initialProducts).forEach((cat) => {
          const category = cat as ProductTab

          category === 'All'
            ? (updatedProducts.All = allProducts)
            : (updatedProducts[category] = allProducts.filter(
                (item) => item.category === category
              ))
        }) // [All, Clothing, ...]

        setProducts(updatedProducts)
        setLoading(false)
      },
      error: (err) => {
        setError(err.message)
        setLoading(false)
      },
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch the product-counts collection from firestore
  useEffect(() => {
    const unsubscribe = productCountsRef
      .doc('counts')
      .onSnapshot((snapshot) => {
        const countsData = snapshot.data() as ProductCounts

        setProductCounts(countsData)
      })

    return () => unsubscribe()
  }, [])

  return (
    <ProductsStateContext.Provider
      value={{ products, productCounts, loading, error, searchedProducts }}
    >
      <ProductsDispatchContext.Provider
        value={{ setProducts, setSearchedProducts }}
      >
        {children}
      </ProductsDispatchContext.Provider>
    </ProductsStateContext.Provider>
  )
}

export default ProductsContextProvider

export const useProductsContext = () => {
  const productsState = useContext(ProductsStateContext)
  const productsDispatch = useContext(ProductsDispatchContext)

  if (productsState === undefined || productsDispatch === undefined)
    throw new Error(
      'useProductsContext must be used within ProductsContextProvider.'
    )

  return { productsState, productsDispatch }
}
