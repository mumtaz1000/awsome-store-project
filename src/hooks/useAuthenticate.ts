import {useAuthContext, openUserDropdown} from '../state/auth-context'
import { useAsyncCall } from './useAsyncCall'
import { SignupData } from '../types'
import { auth, functions } from '../firebase/config'

export const useAuthenticate = () => {
  const {authState: {isUserDropdownOpen}, authDispatch} = useAuthContext()
  const { loading, setLoading, error, setError } = useAsyncCall()

  const signup = async (data: SignupData) => {
    const { username, email, password } = data

    try {
      setLoading(true)

      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      )

      if (!response) {
        setError('Sorry, something went wrong.')
        setLoading(false)
        return
      }

      // Update the user displayname in firebase authentication
      await auth.currentUser?.updateProfile({
        displayName: username,
      })

      // Call onSignup functions to create a new user in firestore
      const onSignup = functions.httpsCallable('onSignup')

      const data = await onSignup({ username })

      setLoading(false)

      return data
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)
    }
  }

  const signout = () => {
    auth.signOut().then(() => {
      if (isUserDropdownOpen) authDispatch(openUserDropdown(false))
    }).catch(err => alert('Soryy, something went wrong.'))
  }

  return { signup, signout, loading, error }
}
