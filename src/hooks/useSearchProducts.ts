import { useAsyncCall } from './useAsyncCall'
import { productsIndex } from '../algolia'
import { SearchedProduct } from '../types'

export const useSearchProducts = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const searchProducts = async (searchString: string) => {
    try {
      setLoading(true)

      const result = await productsIndex.search<SearchedProduct>(searchString)

      setLoading(false)

      return result.hits
    } catch (err) {
      setError('Sorry, something went wrong.')
      setLoading(false)

      return false
    }
  }

  return { searchProducts, loading, error }
}
