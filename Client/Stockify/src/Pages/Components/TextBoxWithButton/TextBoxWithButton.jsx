import React, { useEffect, useRef, useState } from 'react'
import Styles from './TextBoxWithButton.module.css'
function TextBoxWithButton({Logo , ButtonLogo , IsMandatory , FloatingText , Type , ButtonCallBack , TBCallBack , Reference , IsFallBack ,ColorPallete}) {
    //Hooks
    const [TextBoxData , SetTextBoxData] = useState('');
    const [DataTypeRegex , SetDataTypeRegex] = useState();
    const [IsTextBoxFocused , SetIsTextBoxFocused] = useState(false);
    useEffect(() => {
        TBCallBack()
    } , [TextBoxData])
    // const TextBoxRef = useRef();
    useEffect(() => {
        SetDataType()
    } , [])

    //Functions
    const HandleInput = async (e) => {
        SetTextBoxData(e.target.value)
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
            <button className = {Styles['TextBox-Btn']} style={{backgroundColor:ColorPallete[0]}} onClick={() => ButtonCallBack()}>
                <ButtonLogo />
            </button>
        </div>
        
                
    </div>
  )
}

export default TextBoxWithButton