import { Stripe } from '@stripe/stripe-js'

import { useAsyncCall } from './useAsyncCall'
import { CreatePaymentIntentData, PaymentMethod } from '../types'
import { functions } from '../firebase/config'

export const useCheckout = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const completePayment = async (
    createPaymentInentData: CreatePaymentIntentData,
    stripe: Stripe,
    payment_method: PaymentMethod,
    save: boolean | undefined
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

      // 2. Confirm the payment
      const confirmPayment = await stripe.confirmCardPayment(
        paymentIntent.data.clientSecret,
        {
          payment_method,
          save_payment_method: save,
        }
      )

      if (confirmPayment?.error?.message) {
        setError(confirmPayment.error.message)
        setLoading(false)
        return false
      }

      if (confirmPayment.paymentIntent?.status === 'succeeded') {
        setLoading(false)
        return true
      }

      return false
    } catch (err) {
      setError('Sorry, something went wrong.')
      setLoading(false)

      return false
    }
  }

  const createStripeCustomerId = async () => {
    try {
      setLoading(true)

      const createStripeCustomer = functions.httpsCallable(
        'createStripeCustomer'
      )

      const stripeCustomerData = (await createStripeCustomer()) as {
        data: { customerId: string }
      }

      return stripeCustomerData.data.customerId
    } catch (error) {
      setError('Sorry, something went wrong.')
      setLoading(false)

      return undefined
    }
  }

  return { completePayment, createStripeCustomerId, loading, error }
}
