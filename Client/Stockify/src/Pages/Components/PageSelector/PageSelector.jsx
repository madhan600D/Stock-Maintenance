import React, { useEffect, useState } from 'react'
import Styles from './PageSelector.module.css'
function PageSelector({CurrentPage , SetCurrentPage , PageHeader , Dimension = ['100%' , 'max-content']}) {
    //Hooks
    const [SelectedPage , SetSelectedPage] = useState(CurrentPage);
    useEffect(() => {
        SetSelectedPage(CurrentPage)
    } , [CurrentPage])
    //Functions
    const HandlePageSelectorButtonClick = async (Param) => {
        SetSelectedPage(Param)
        SetCurrentPage(Param)
    }

  return (
    <div className = {Styles['Main-Div']} style={{width:Dimension[0] , height:Dimension[1]}}>
        <button onClick={() => HandlePageSelectorButtonClick('Login')} className = {Styles['LoginPage-Btn']} style={{background:SelectedPage === 'Login' ? "#3c3c3cb6" : "none" , boxShadow:SelectedPage === 'Login' ? "inset 0 0 10px rgba(255, 255, 255, 0.259)" : "" , borderRadius:SelectedPage === 'Login' ? "5px" : "0" , border:SelectedPage === 'SignUp' ? "solid 1px rgba(255, 255, 255, 0.07)" : "0" ,border:SelectedPage === 'Login' ? "3px solid rgba(255, 255, 255, 1)": "1px solid rgba(255, 255, 255, 0.07)" }}>
            {PageHeader[0]}
        </button>
        <button onClick={() => HandlePageSelectorButtonClick('SignUp')} className = {Styles['SignUpPage-Btn']} style={{background:SelectedPage === 'SignUp' ? "#3c3c3cb6" : "none" , boxShadow:SelectedPage === 'SignUp' ? "inset 0 0 10px rgba(255, 255, 255, 0.259)" : "" , borderRadius:SelectedPage === 'SignUp' ? "5px" : "0" ,border:SelectedPage === 'SignUp' ? "3px solid rgba(255, 255, 255, 1)": "1px solid rgba(255, 255, 255, 0.07)"}}>
            {PageHeader[1]}
        </button>
    </div>
  )
}

export default PageSelector