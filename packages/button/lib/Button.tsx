import React from 'react'

import ButtonProps from './Props'

const Button = ({ text }: ButtonProps) => {
  return (
    <div>{text}</div>
  )
}

export default Button