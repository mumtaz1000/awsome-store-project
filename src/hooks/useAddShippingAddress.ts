import { useAsyncCall } from './useAsyncCall'
import { Address, UserInfo } from '../types'
import { firebase } from '../firebase/config'
import { usersRef } from '../firebase'

export const useAddShippingAddress = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const addNewAddress = async (
    data: Omit<Address, 'index'>,
    userInfo: UserInfo
  ) => {
    try {
      setLoading(true)

      const updatedUserInfo = {
        shippingAddresses: userInfo.shippingAddresses
          ? [...userInfo.shippingAddresses, data]
          : [data],
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      // Update the user document in the users collection in firestore
      await usersRef.doc(userInfo.id).set(updatedUserInfo, { merge: true })
      setLoading(false)

      return true
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)

      return false
    }
  }

  return { addNewAddress, loading, error }
}
