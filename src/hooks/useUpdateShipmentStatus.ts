import { useAsyncCall } from './useAsyncCall'
import { ShipmentStatus } from '../types'
import { firebase } from '../firebase/config'
import { ordersRef } from '../firebase'

export const useUpdateShipmentStatus = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const updateStatus = async (orderId: string, newStatus: ShipmentStatus) => {
    try {
      setLoading(true)

      await ordersRef.doc(orderId).set(
        {
          shipmentStatus: newStatus,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      setLoading(false)

      return true
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)

      return false
    }
  }

  return { updateStatus, loading, error }
}
