import React from 'react'

import Button from '../Button'

interface Props {}

const SIgnup: React.FC<Props> = () => {
  return (
    <>
      <div className='backdrop'> </div>

      <div className='modal modal--auth-form'>
        <div className='modal-close'>&times;</div>

        <h3 className='header--center paragraph--orange'>
          Sign up to AwesomeShop
        </h3>

        <form className='form'>
          <div className='form__input-container'>
            <label htmlFor='Username' className='form__input-label'>
              Username
            </label>
            <input
              type='text'
              name='username'
              className='input'
              placeholder='Your username'
            />
          </div>
          <div className='form__input-container'>
            <label htmlFor='Email' className='form__input-label'>
              Email
            </label>
            <input
              type='text'
              name='email'
              className='input'
              placeholder='Your email'
            />
          </div>
          <div className='form__input-container'>
            <label htmlFor='Password' className='form__input-label'>
              Password
            </label>
            <input
              type='password'
              name='password'
              className='input'
              placeholder='Your password'
            />
          </div>

          <Button width='100%' style={{ margin: '0.5rem 0' }}>
            Submit
          </Button>
        </form>
      </div>
    </>
  )
}

export default SIgnup
