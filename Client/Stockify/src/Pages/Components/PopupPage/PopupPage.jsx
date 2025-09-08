import React from 'react'
import Styles from './PopupPage.module.css'
function PopupPage({Component}) {
  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['Menu-Div']}>

        </div>
        <div className = {Styles['Component-Div']}>

        </div>
    </div>
  )
}

export default PopupPage