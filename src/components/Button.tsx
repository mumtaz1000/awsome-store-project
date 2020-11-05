import React, { ButtonHTMLAttributes, forwardRef, Ref } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  height?: string
  width?: string
  loading?: boolean
  spinnerColor?: string
  spinnerHeight?: number
  spinnerWidth?: number
}

const Button = forwardRef(
  (
    {
      children,
      disabled,
      style,
      className,
      height = '2.7rem',
      width = '9rem',
      loading,
    }: Props,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        className={`btn ${className}`}
        disabled={disabled}
        style={{
          cursor: loading ? 'not-allowed' : undefined,
          height,
          width,
          ...style,
        }}
      >
        {children}
      </button>
    )
  }
)

export default Button
