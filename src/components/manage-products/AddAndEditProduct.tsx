import React, { useRef, ChangeEvent, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Input from '../Input'
import Button from '../Button'
import { useAuthContext } from '../../state/auth-context'
import { useManageProduct } from '../../hooks/useManageProduct'
import { AddProductData, Product } from '../../types'
import { categories } from '../../helpers'

const fileType = ['image/png', 'image/jpeg', 'image/jpg']

interface Props {
  setOpenProductForm: (open: boolean) => void
  productToEdit: Product | null
}

const AddAndEditProduct: React.FC<Props> = ({
  setOpenProductForm,
  productToEdit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    authState: { authUser },
  } = useAuthContext()

  const {
    uploadImageToStorage,
    addNewProduct,
    addProductFinished,
    setUploadProgression,
    uploadProgression,
    loading,
    error,
  } = useManageProduct()

  const { register, handleSubmit, errors, reset } = useForm<AddProductData>()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (addProductFinished) {
      reset()
      setSelectedFile(null)
      setUploadProgression(0)
    }
  }, [addProductFinished, reset, setUploadProgression, setSelectedFile])

  const handleOpenUploadBox = () => {
    if (inputRef?.current) inputRef.current.click()
  }

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || !files[0]) return

    const file = files[0]

    if (!fileType.includes(file.type)) {
      alert('Wrong file format, allow only "png" or "jpeg", or "jpg"')
      return
    }

    setSelectedFile(file)
  }

  const handleAddProduct = handleSubmit((data) => {
    if (!selectedFile || !authUser) return

    return uploadImageToStorage(
      selectedFile,
      addNewProduct(data, authUser?.uid)
    )
  })

  const handleEditProduct = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <>
      <div className='backdrop' onClick={() => setOpenProductForm(false)}>
        {' '}
      </div>

      <div className='modal modal--add-product'>
        <div className='modal-close' onClick={() => setOpenProductForm(false)}>
          &times;
        </div>

        <h2 className='header--center'>Add A New Product</h2>

        <form
          className='form'
          onSubmit={productToEdit ? handleEditProduct : handleAddProduct}
        >
          {/* Title */}
          <Input
            label='Title'
            name='title'
            placeholder='Product title'
            defaultValue={productToEdit ? productToEdit.title : ''}
            ref={register({
              required: 'Titile is requried.',
              minLength: {
                value: 3,
                message: 'Product title must be at least 3 characters.',
              },
            })}
            error={errors.title?.message}
          />

          {/* Description */}
          <Input
            label='Description'
            name='description'
            placeholder='Product description'
            defaultValue={productToEdit ? productToEdit.description : ''}
            ref={register({
              required: 'Description is requried.',
              minLength: {
                value: 6,
                message: 'Product description must be at least 6 characters.',
              },
              maxLength: {
                value: 200,
                message:
                  'Product description must be not more than 200 characters.',
              },
            })}
            error={errors.description?.message}
          />

          {/* Price */}
          <Input
            label='Price'
            type='number'
            name='price'
            placeholder='Product price'
            defaultValue={productToEdit ? productToEdit.price : ''}
            ref={register({
              required: 'Price is requried.',
              min: {
                value: 1,
                message: 'Product price must have at least $1.',
              },
            })}
            error={errors.price?.message}
          />

          {/* Image */}
          <div className='form__input-container'>
            <label htmlFor='Image' className='form__input-label'>
              Image
            </label>

            <div className='form__input-file-upload'>
              {uploadProgression ? (
                <div style={{ width: '70%' }}>
                  <input
                    type='text'
                    className='upload-progression'
                    style={{
                      width: `${uploadProgression}%`,
                      color: 'white',
                      textAlign: 'center',
                    }}
                    value={`${uploadProgression}%`}
                  />
                </div>
              ) : (
                <input
                  type='text'
                  name='imageFileName'
                  className='input'
                  readOnly
                  style={{ width: '70%', cursor: 'pointer' }}
                  onClick={handleOpenUploadBox}
                  value={
                    selectedFile
                      ? selectedFile.name
                      : productToEdit
                      ? productToEdit.imageFileName
                      : ''
                  }
                  ref={register({ required: 'Product image is required.' })}
                />
              )}

              <Button
                width='30%'
                height='100%'
                type='button'
                style={{ borderRadius: '0', border: '1px solid #282c3499' }}
                onClick={handleOpenUploadBox}
              >
                <span className='paragraph--small'>Select image</span>
              </Button>

              <input
                type='file'
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleSelectFile}
              />
            </div>

            {errors?.imageFileName && !selectedFile && (
              <p className='paragraph paragraph--error-small'>
                {errors.imageFileName.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className='form__input-container'>
            <label htmlFor='Category' className='form__input-label'>
              Category
            </label>

            <select
              name='category'
              className='input'
              defaultValue={productToEdit ? productToEdit.category : undefined}
              ref={register({ required: 'Product category is required.' })}
            >
              <option style={{ display: 'none' }}></option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {errors?.category && (
              <p className='paragraph paragraph--error-small'>
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Inventory */}
          <Input
            label='Inventory'
            type='number'
            name='inventory'
            placeholder='Product inventory'
            defaultValue={productToEdit ? productToEdit.inventory : ''}
            ref={register({
              required: 'Inventory is requried.',
              min: 0,
              pattern: {
                value: /^[0-9]\d*$/,
                message: 'Inventory must be the positive whole number.',
              },
            })}
            error={errors.inventory?.message}
          />

          <Button
            className='btn--orange'
            width='100%'
            style={{ marginTop: '1rem' }}
            loading={loading}
            disabled={loading}
          >
            Submit
          </Button>
        </form>

        {error && <p className='paragraph paragraph--error'>{error}</p>}
      </div>
    </>
  )
}

export default AddAndEditProduct

// const fileType = ['image/png', 'image/jpeg', 'image/jpg']
