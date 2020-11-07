import { useAsyncCall } from './useAsyncCall'
import { SignupData } from '../types'
import { auth } from '../firebase/config'

export const useAuthenticate = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const signup = async (data: SignupData) => {
    const { username, email, password } = data

    try {
      setLoading(true)

      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      )

      if (response) {
        auth.currentUser?.updateProfile({
          displayName: username,
        })

        setLoading(false)
        console.log('User -->', response)
      }
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)
    }
  }

  return { signup, loading, error }
}
