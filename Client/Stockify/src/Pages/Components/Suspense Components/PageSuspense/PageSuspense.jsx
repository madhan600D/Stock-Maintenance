import React from 'react'
import Styles from './PageSuspense.module.css'
import useUser from '../../../../Stores/UserStore'
import { HiLightBulb } from "react-icons/hi";
import FallBackSpinner from '../FallBackSpinner/FallBackSpinner.jsx'
function PageSuspense() {
  //Destructure
  //Suspense Texts contains an array of Loading texts
  const {SuspenseTexts} = useUser();

  //Functions
  const GetRandomIndex = () => {
    try {
      let Bounds = SuspenseTexts.length - 1;
      const Index = Math.floor(Math.random() * Bounds)
      return Index
    } catch (error) {
      return 0
    }
}
  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['LoadingText-Div']}>
          <div className = {Styles['LoadingTextHeader-Div']}>
            <HiLightBulb className = {Styles['LightBulb-Icon']}/>
            <label className = {Styles['LoadingText-Label']}>
              Did You Know...?
            </label>
          </div>
          
          <label className = {Styles['LoadingTextBody-Label']}>
            {SuspenseTexts[GetRandomIndex()]}
          </label>
          
          <div  >
            <FallBackSpinner />
          </div>
          
        </div>
    </div>
  )
}

export default PageSuspense

