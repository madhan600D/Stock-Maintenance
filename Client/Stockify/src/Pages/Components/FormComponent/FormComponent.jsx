import React, { useState ,useRef, useEffect } from 'react'
import Styles from './FormComponent.module.css'

//Components
import Skeleton from '@mui/material/Skeleton';
import Stepper from '../StepperComponent/Stepper';
import Box from '@mui/material/Box';

//Icons
import { MdNextPlan } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

//MUI components
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
function FormComponent({Structure, ReducerState  , Reference , LoadingState , LoadingComponent , SubmitCallback , BGColor = '#282a2e'}) {
  //PropStructure: Form:{Section1:[SubSection1:{Heading , ElementArray, GridSpan}, SubSection2 , SubmitCallBack()]}

  //States
  //Set 1st section as starting state
  const [Page , SetPage] = useState(0)
  const [Section, SetSection] = useState(Object.keys(Structure)[Page]);


  const HandlePrevPage = () => {
    SetPage(Prev => Prev - 1)
  }
  const HandleNextPage = () => {
    SetPage(Prev => Prev + 1)

  }

  //Effects

  useEffect(() => {
    SetSection(Object.keys(Structure)[Page])
  } , [Structure , Page])

  if(!LoadingState){
    return (
    <div ref={Reference} className = {Styles['Main-Div']} style={{backgroundColor:BGColor}}>
      {/* The Node at top of the form */}
      <div className = {Styles['Nodes-Div']}>
        <div>
          <Stepper 
            CurrentSection={Page}
            Sections={Object.keys(Structure)}
          />
        </div>
        
      </div>
      {/* Parse the current section from structure prop */}
      <h2 className = {Styles['Section-Label']}>{Section}</h2>
      <div className={Styles['Section-Div']}>
          {Structure[Section].map((Value, Index) => (
            Object.entries(Value).map((SubSection, SubSectionIndex) => (
              <>
                <label className={Styles['SubSection-Label']}>{SubSection[0]}</label>
                <div className={Styles['SubSection-Div']} key={SubSectionIndex} style={{gridTemplateColumns: `repeat(${SubSection[1].GridSpan}, 1fr)`}}>
                  {SubSection[1].ArrayOfElements.map((Component, Idx) => (
                    <React.Fragment key={Idx}>{Component}</React.Fragment>
                  ))}
              </div>
              </>
              
            ))
        ))}
      </div>

      <div className = {Styles['Footer-Div']}>
        <Button className = {Styles['Prev-Btn']} disabled = {Page <= 0} variant="contained"  color="primary" onClick={() => {HandlePrevPage()}}> PREV </Button>
        <Button className = {Styles['Next-Btn']} disabled = {Page >= Object.keys(Structure).length - 1} variant="contained" disableElevation color="primary" onClick={() => {HandleNextPage()}}> NEXT </Button>
        {/* Render Submit button at last page  */}
      {Page == Object.keys(Structure).length - 1 ?  <button className = {Styles['Submit-Btn']} onClick={() => {SubmitCallback()}}>CONFIRM</button> : ""}
      </div>
      
    </div>
  )
  }
  else{
    return(
    <div className = {Styles['Main-Div']}>
          <div className = {Styles['Loader-Div']}>
            <Skeleton variant="rectangular" width={'100%'} height={25} />
            <Skeleton variant="circular" width={'40px'} height={40} />
            <Skeleton variant="rectangular" width={'100%'} height={60} />
            <Skeleton variant="rounded" width={'100%'} height={300} />
          </div>
    </div>)
  }
  
}

export default FormComponent