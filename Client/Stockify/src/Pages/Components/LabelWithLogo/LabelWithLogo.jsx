import React from 'react'
import Styles from './LabelWithLogo.module.css'

//Components
import { GiPlainSquare } from "react-icons/gi";
function LabelWithLogo({Header , Value , Logo , BGColor , Dimension}) {
  return (
    <div className = {Styles['Main-Div']} style={{
    height: Dimension !== undefined ? `${Dimension[0]}px` : "",
    width: Dimension !== undefined ? `${Dimension[1]}px` : ""
    }}>
        <div style={{backgroundColor:BGColor}} className={Styles['Logo-Div']}>
            <Logo className = {Styles['Logo']} />
        </div>
        <div className = {Styles['Content-Div']}>
            <label style={{fontWeight:'bolder' , color:'#181818c8'}}>{Value}</label>
            <label>{Header}</label>
        </div>

    </div>
  )
}

export default LabelWithLogo