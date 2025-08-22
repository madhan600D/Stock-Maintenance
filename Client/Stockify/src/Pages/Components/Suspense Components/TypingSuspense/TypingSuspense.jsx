import React from 'react'
import Styles from './TypingSuspense.module.css'
function TypingSuspense() {
  return (
    <div className= {Styles['loader']}>
        <span className= {Styles}></span>
        <span></span>
        <span></span>
    </div>
  )
}

export default TypingSuspense