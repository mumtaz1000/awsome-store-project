import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react'

import { useAuthContext } from './auth-context'
import { useAsyncCall } from '../hooks/useAsyncCall'
import { CartItem } from '../types'
import { cartRef, snapshotToDoc } from '../firebase'

interface Props {}

type CartState = {
  cart: CartItem[] | null
  loading: boolean
  error: string
}

type CartDispatch = {
  setCart: Dispatch<SetStateAction<CartItem[] | null>>
}

const CartStateContext = createContext<CartState | undefined>(undefined)
const CartDispatchContext = createContext<CartDispatch | undefined>(undefined)

const CartContextProvider: React.FC<Props> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[] | null>(null)

  const {
    authState: { authUser },
  } = useAuthContext()
  const { loading, setLoading, error, setError } = useAsyncCall()

  useEffect(() => {
    setLoading(true)

    if (!authUser) {
      // User is not authenticated
      setCart(null)
      setLoading(false)
      return
    }

    // User is authenticated
    const unsubscribe = cartRef
      .where('user', '==', authUser.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot({
        next: (snapshots) => {
          const cart: CartItem[] = []

          snapshots.forEach((snapshot) => {
            const cartItem = snapshotToDoc<CartItem>(snapshot)

            cart.push(cartItem)
          })

          setCart(cart)
        },
        error: (err) => {
          setError(err.message)
          setLoading(false)
        },
      })

      return () => unsubscribe()
  }, [authUser, setCart, setLoading, setError])

  return (
    <CartStateContext.Provider value={{ cart, loading, error }}>
      <CartDispatchContext.Provider value={{ setCart }}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  )
}

export default CartContextProvider

export const useCartContext = () => {
  const cartState = useContext(CartStateContext)
  const cartDispatch = useContext(CartDispatchContext)

  if (cartState === undefined || cartDispatch === undefined)
    throw new Error('useCartContext must be used within CartContextProvider.')

  return { ...cartState, ...cartDispatch }
}
