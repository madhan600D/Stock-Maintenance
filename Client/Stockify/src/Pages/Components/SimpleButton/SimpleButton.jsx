import React, { useState } from 'react'
import Styles from './SimpleButton.module.css'
function SimpleButton({ButtonText , Dimensions , BGColor , Callback}) {
    return (
        <button style={{width:`${Dimensions[0]}rem`   ,backgroundColor:BGColor}} className = {Styles['Btn']} onClick={() => {Callback()}}>
        <label className= {Styles['lbl']}>{ButtonText}</label>
        
        </button>
    )
}

export default SimpleButton