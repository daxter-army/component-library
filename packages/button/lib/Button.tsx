import React from 'react';
import Label from '@daxter-army/label';

import ChevronIcon from "./assets/chevron-down.png";

import './Styles.css';

import ButtonProps from './Props'

const Button = ({ text }: ButtonProps) => {
  return (
    <button className='buttonWpr'>
      <img src={ChevronIcon} className='buttonWpr-logo' alt="button-logo" />
      <Label label={text} />
    </button>
  )
}

export default Button