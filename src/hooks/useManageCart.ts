import { useAsyncCall } from './useAsyncCall'
import { UploadCartItem } from '../types'
import { firebase } from '../firebase/config'
import { cartRef } from '../firebase'

export const useManageCart = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const addToCart = async (
    productId: string,
    quantity: number,
    userId: string,
    inventory: number
  ) => {
    try {
      setLoading(true)

      // Query the cart item from firestore
      const cartItemRef = cartRef.doc(`${userId}-${productId}`)
      const snapshot = await cartItemRef.get()

      let cartItem: UploadCartItem

      if (!snapshot.exists) {
        // The selected product item is not already in the cart, create a new cart item
        cartItem = {
          product: productId,
          quantity,
          user: userId,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
      } else {
        // The selected product item is already in the cart, update the cart item's quantity
        const currentCartItem = snapshot.data() as UploadCartItem

        cartItem = {
          ...currentCartItem,
          quantity:
            currentCartItem.quantity + quantity > inventory
              ? inventory
              : currentCartItem.quantity + quantity,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
      }

      await cartItemRef.set(cartItem)
      setLoading(false)

      return true
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)

      return false
    }
  }

  return { addToCart, loading, error }
}
