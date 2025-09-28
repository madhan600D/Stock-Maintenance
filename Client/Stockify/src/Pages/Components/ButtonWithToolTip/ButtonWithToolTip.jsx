import React from 'react'
import Styles from './ButtonWithToolTip.module.css';
function ButtonWithToolTip({ButtonLogo , ToolTipText , Reference , ButtonCallBack , ColorPalatte}) {
  const HandleButtonClick = async () =>{
    ButtonCallBack()
  }
  return (
    <div className={Styles['Main-Div']}>
        <button ref={Reference} className={Styles['Main-Btn']} onClick={HandleButtonClick} style={{backgroundColor:ColorPalatte[2]}}>
            <ButtonLogo className={Styles['Front']} style={{fill:ColorPalatte[0]}}/>
            <p className={Styles['Back']} style={{color:ColorPalatte[1]}}>{ToolTipText}</p>
    </button>
    </div>
  )
}

export default ButtonWithToolTip