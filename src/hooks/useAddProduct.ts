import { useState } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { AddProductData } from '../types'
import { createImageRef } from '../firebase'

export const useAddProduct = () => {
  const [uploadProgression, setUploadProgression] = useState(0)

  const { loading, setLoading, error, setError } = useAsyncCall()

  const addNewProduct = (image: File, data: AddProductData) => {
    setLoading(true)

    // 1. Upload an image to firebase storage, get back an image url
    const imageRef = createImageRef(image.name)
    const uploadTask = imageRef.put(image)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate upload progression
        const progression =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100

        setUploadProgression(progression)
      },
      (err) => {
        // Error case
        setError(err.message)
        setLoading(false)
      },
      () => {
        // Sucess case
        setUploadProgression(0)

        // Get the image url
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then((imageUrl) => {
            // 2. Create a new document in the products collection in firestore, requires product data and the image url
          })
          .catch((err) => {
            const { message } = err as { message: string }

            setError(message)
            setLoading(false)
          })
      }
    )
  }
}
