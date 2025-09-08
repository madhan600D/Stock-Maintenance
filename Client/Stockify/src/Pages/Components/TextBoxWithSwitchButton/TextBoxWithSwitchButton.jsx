import React, { useEffect, useRef, useState } from 'react'
import Styles from './TextBoxWithSwitchButton.module.css'

import FallBackSpinner from '../Suspense Components/FallBackSpinner/FallBackSpinner';
function TextBoxWithSwitchButton({Logo , ButtonLogo , IsMandatory , FloatingText , Type , ButtonCallBack  , TBCallBack , ToolTip , Reference , IsSuspense ,ColorPallete}) {
    //Hooks
    const [TextBoxData , SetTextBoxData] = useState('');
    const [DataTypeRegex , SetDataTypeRegex] = useState();
    const [IsTextBoxFocused , SetIsTextBoxFocused] = useState(false);
    const [IsChecked , SetIsChecked] = useState(false);
    const [ShowToolTip , SetShowToolTip] = useState(false);
    useEffect(() => {
        TBCallBack()
    } , [TextBoxData])
    // const TextBoxRef = useRef();
    useEffect(() => {
        SetDataType()
    } , [])

    //Destructure
    const [FirstComponent , SecondComponent] = ButtonLogo;

    //Functions
    const HandleInput = async (e) => {
        SetTextBoxData(e.target.value)
    }

    const HandleCheckButtonClick = async () => {
        if(IsChecked){
            SetIsChecked(false)
        }
        else{
            SetIsChecked(true)
        }
        ButtonCallBack()
    }

    const HandleEnterKey = async (e) => {
        if(e.key === "Enter"){
            Reference.current.blur()
        }
    }
    const SetDataType = async () => {
        if(Type == "STRING"){
            SetDataTypeRegex("^[A-Za-z]+$")
        }
        else if(Type == "INTEGER"){
            SetDataTypeRegex("^[0-9]+$")
        }
        else if (Type == "ALL"){
            SetDataTypeRegex("^[A-Za-z0-9]+$")
        }
        else{
            SetDataTypeRegex("")
        
        }   
    }


  return (
    <div className= {Styles['Main-Div']}>
        <div className = {Styles['Logo-Div']} style = {{background:ColorPallete[0]}}>
            <Logo />
        </div>
        <div className = {Styles['TexBoxAndLogo-Div']}>
            <input value={TextBoxData} ref={Reference} onChange={HandleInput} pattern = {DataTypeRegex}  className= {Styles['TextBox-Input']} onFocus={() => SetIsTextBoxFocused(true)} onBlur={() => SetIsTextBoxFocused(false)} onKeyDown={HandleEnterKey}/>

            <p className= {Styles['TextBox-Label']} style={{color:IsTextBoxFocused ? ColorPallete[1] : "#2d2d28ff" , 
                transform:TextBoxData.length > 0 ? "translate(0,-2rem)" : "",
                color:TextBoxData.length > 0 ? ColorPallete[1] : ColorPallete[1] , fontWeight:IsTextBoxFocused ? "bold" : ""
            }}>{IsMandatory ? "* " + FloatingText : FloatingText}
            </p>
            <button className = {Styles['TextBox-Btn']} style={{backgroundColor:ColorPallete[0] , '--ToolTipEdge': ColorPallete[0]}} onClick={() => HandleCheckButtonClick()} onMouseEnter={() => {SetShowToolTip(true)}} onMouseLeave={() => {SetShowToolTip(false)}}>
                {IsSuspense ? <FallBackSpinner /> : IsChecked ? <FirstComponent/> : <SecondComponent />}
            </button>
            {ShowToolTip ? <label className = {Styles['ToolTip-Lbl']} style={{backgroundColor:ColorPallete[1]}}>
                {IsChecked ? ToolTip[0] : ToolTip[1]}
            </label> : ''}
            
        </div>
        
                
    </div>
  )
}

export default TextBoxWithSwitchButton