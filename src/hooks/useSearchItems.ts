import { useProductsContext } from '../state/products-context'
import { useAsyncCall } from './useAsyncCall'
import { firebase } from '../firebase/config'
import { productsIndex } from '../algolia'
import { SearchedProduct } from '../types'

export const useSearchItems = (pathname: string) => {
  const { loading, setLoading, error, setError } = useAsyncCall()
  const {
    productsDispatch: { setSearchedProducts },
  } = useProductsContext()

  const searchItems = async (searchString: string) => {
    try {
      setLoading(true)

      if (pathname === '/' || '/products' || '/admin/manage-products') {
        const result = await productsIndex.search<SearchedProduct>(searchString)

        const products = result.hits.map((item) => {
          const createdAt = firebase.firestore.Timestamp.fromDate(
            new Date(item.createdAt._seconds * 1000)
          )

          const updatedAt = item.updatedAt
            ? firebase.firestore.Timestamp.fromDate(
                new Date(item.updatedAt._seconds * 1000)
              )
            : undefined

          return { ...item, id: item.objectID, createdAt, updatedAt }
        })

        setSearchedProducts(products)

        setLoading(false)

        return true
      }
    } catch (err) {
      setError('Sorry, something went wrong.')
      setLoading(false)

      return false
    }
  }

  return { searchItems, loading, error }
}
