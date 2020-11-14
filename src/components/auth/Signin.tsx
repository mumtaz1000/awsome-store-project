import React from 'react'
import { useForm } from 'react-hook-form'

import Button from '../Button'
import Input from '../Input'
import { useModalContext } from '../../state/modal-context'
import { useAuthenticate } from '../../hooks'
import { SignupData } from '../../types'

interface Props {}

const Signin: React.FC<Props> = () => {
  const { setModalType } = useModalContext()
  const { signin, loading, error } = useAuthenticate()
  const { register, errors, handleSubmit } = useForm<
    Omit<SignupData, 'username'>
  >()

  const handleSignin = handleSubmit(async (data) => {
    const response = await signin(data)

    if (response) setModalType('close')
  })

  return (
    <>
      <div className='backdrop' onClick={() => setModalType('close')}>
        {' '}
      </div>

      <div className='modal modal--auth-form'>
        <div className='modal-close' onClick={() => setModalType('close')}>
          &times;
        </div>
        <h3 className='header--center paragraph--orange'>
          Sign in to AwesomeShop
        </h3>
        <form className='form' onSubmit={handleSignin}>
          <Input
            name='email'
            label='Email'
            placeholder='Your email'
            error={errors.email?.message}
            ref={register({
              required: 'Email is required.',
            })}
          />

          <Input
            type='password'
            name='password'
            label='Password'
            placeholder='Your password'
            error={errors.password?.message}
            ref={register({
              required: 'Password is required.',
            })}
          />

          <Button loading={loading} width='100%' style={{ margin: '0.5rem 0' }}>
            Submit
          </Button>

          {error && <p className='paragraph paragraph--error'>{error}</p>}
        </form>

        <p className='paragraph paragraph--focus paragraph--small'>
          Don't have an account yet?{' '}
          <span
            className='paragraph--orange paragraph--link'
            onClick={() => setModalType('signup')}
          >
            sign up
          </span>{' '}
          instead.
        </p>

        <p className='paragraph paragraph--focus paragraph--small'>
          Forgot your password? Click{' '}
          <span
            className='paragraph--orange paragraph--link'
            onClick={() => setModalType('reset_password')}
          >
            here
          </span>
        </p>
      </div>
    </>
  )
}

export default Signin
