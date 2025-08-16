import React, { useState } from 'react'
import Styles from './FormComponent.module.css'
function FormComponent({Inputs, BtnCallBack , LoadingState , LoadingComponent}) {
  
  //States
  const [FormData , SetFormData] = useState();

  if(!LoadingState){
    return (
    <div className = {Styles['Main-Div']}>
      {/* //Parse array and render all text TextBoxes inside a fragement with unique key */}
      {Object.entries(Inputs).map(([SectionKey , InputArray]) => (
        <>
          <label className = {Styles['Sections-Label']}>{SectionKey.toUpperCase()}</label>
          <div key = {SectionKey} className = {Styles['Sections-Div']}>  
            {InputArray.map((TextBox , Index) => <React.Fragment key={Index}>{TextBox}</React.Fragment>)}          
          </div>
        </>
      ))}
      <button className = {Styles['Submit-Btn']} onClick={() => {BtnCallBack()}}>SUBMIT</button>
    </div>
  )
  }
  else{
    <div className = {Styles['Main-Div']}>
      <div className = {Styles['Loader-Div']}>
          {<LoadingComponent />}
      </div>
    </div>
  }
  
}

export default FormComponent