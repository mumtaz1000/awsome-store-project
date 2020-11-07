import React from 'react'
import { useForm } from 'react-hook-form'

import Button from '../Button'
import Input from '../Input'

interface Props {}

const SIgnup: React.FC<Props> = () => {
  const { register, errors, handleSubmit } = useForm<{
    username: string
    email: string
    password: string
  }>()

  const handleSignup = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <>
      <div className='backdrop'> </div>

      <div className='modal modal--auth-form'>
        <div className='modal-close'>&times;</div>

        <h3 className='header--center paragraph--orange'>
          Sign up to AwesomeShop
        </h3>

        <form className='form' onSubmit={handleSignup}>
          <Input
            name='username'
            label='Username'
            placeholder='Your username'
            error={errors.username?.message}
            ref={register({
              required: 'Username is required.',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters.',
              },
              maxLength: {
                value: 20,
                message: 'Username must not be greater thant 20 characters.',
              },
            })}
          />

          <Input
            name='email'
            label='Email'
            placeholder='Your email'
            error={errors.email?.message}
            ref={register({
              required: 'Email is required.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email is in wrong format.',
              },
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
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters.',
              },
              maxLength: {
                value: 50,
                message: 'Password must not be greater thant 50 characters.',
              },
            })}
          />

          <Button width='100%' style={{ margin: '0.5rem 0' }}>
            Submit
          </Button>
        </form>
      </div>
    </>
  )
}

export default SIgnup
