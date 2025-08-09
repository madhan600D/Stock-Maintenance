import React from 'react'
import Styles from './CheckerComponent.module.css'
function CheckerComponent({CheckerLogo , CheckerLabel , IsChecked , ColorPallete}) {
  return (
    <div className = {Styles['Main-Div']}  >
        <input className = {Styles['CheckBox-Input']} type = 'checkbox' />
        <CheckerLogo className = {Styles['Checker-Logo']}/>
        {/* <p className = {Styles['Checker-Lbl']}>{CheckerLabel}</p> */}
    </div>
  )
}

export default CheckerComponent