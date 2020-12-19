import { PaymentMethod } from '@stripe/stripe-js'

import { useAsyncCall } from './useAsyncCall'
import { functions } from '../firebase/config'

export const useRemoveCard = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const removeCard = async (payment_method: string) => {
    try {
      setLoading(true)

      const detachPaymentMethod = functions.httpsCallable('detachPaymentMethod')

      const {
        data: { paymentMethod },
      } = (await detachPaymentMethod({ payment_method })) as {
        data: { paymentMethod: PaymentMethod }
      }

      setLoading(false)

      return paymentMethod
    } catch (err) {
      setError('Sorry, something went wrong.')
      setLoading(false)

      return false
    }
  }

  return { removeCard, loading, error }
}
