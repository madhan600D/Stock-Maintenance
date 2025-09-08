import React, { useEffect, useRef, useState } from 'react'
import Styles from './TextBoxWithLogo.module.css'

//Components
import FallBackSpinner from '../Suspense Components/FallBackSpinner/FallBackSpinner';
import TypingSuspense from '../Suspense Components/TypingSuspense/TypingSuspense';
function TextBoxWithLogo({Logo , IsMandatory , FloatingText , Type , TBCallBack , EnterCallBack , Reference , IsLoading ,ColorPallete}) {
    //Hooks
    const [TextBoxData , SetTextBoxData] = useState('');
    const [DataTypeRegex , SetDataTypeRegex] = useState();
    const [IsTextBoxFocused , SetIsTextBoxFocused] = useState(false);
    //To Call the text box change Callback
    useEffect(() => {
        if(Reference.current.value == ""){
            SetTextBoxData("")
        }
        TBCallBack()
    } , [TextBoxData])
    //To set the initial DataType for Datatype
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
        EnterCallBack(e)
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
            {IsLoading ? <FallBackSpinner /> : <Logo className = {Styles['Logo-Svg']} />}
            
        </div>
        <div className = {Styles['TexBoxAndLogo-Div']}>
            <input value={TextBoxData} ref={Reference} onChange={HandleInput} pattern = {DataTypeRegex}  className= {Styles['TextBox-Input']} onFocus={() => SetIsTextBoxFocused(true)} onBlur={() => SetIsTextBoxFocused(false)} onKeyDown={HandleEnterKey}/>

            <p className= {Styles['TextBox-Label']} style={{color:IsTextBoxFocused ? ColorPallete[1] : "#2d2d28ff" , 
                transform:TextBoxData.length > 0 ? "translate(0,-2rem)" : "",
                color:TextBoxData.length > 0 ? ColorPallete[1] : ColorPallete[1] , fontWeight:IsTextBoxFocused ? "bold" : ""
            }}>{IsMandatory ? "* " + FloatingText : FloatingText}
            </p>
        </div>
        
                
    </div>
  )
}

export default TextBoxWithLogo