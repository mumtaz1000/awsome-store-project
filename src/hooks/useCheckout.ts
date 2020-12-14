import { useAsyncCall } from './useAsyncCall'
import { CreatePaymentIntentData } from '../types'
import { functions } from '../firebase/config'

export const useCheckout = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const completePayment = async (
    createPaymentInentData: CreatePaymentIntentData
  ) => {
    try {
      setLoading(true)

      // 1. Call the cloud function, to get a client secret
      const createPaymentIntents = functions.httpsCallable(
        'createPaymentIntents'
      )

      const paymentIntent = (await createPaymentIntents(
        createPaymentInentData
      )) as { data: { clientSecret: string } }

      if (!paymentIntent.data.clientSecret) return

      console.log(paymentIntent.data.clientSecret)

      setLoading(false)
      return true
    } catch (err) {
      setError('Sorry, something went wrong.')
      setLoading(false)

      return false
    }
  }

  return { completePayment, loading, error }
}
