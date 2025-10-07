import React, { useEffect } from 'react';
import Styles from './HomePage.module.css';

//Components
import TopBar from '../Components/TopBar/TopBar.jsx';
import PageHolder from '../Components/PageHolder/PageHolder.jsx';

//Stores
import UseProduct from '../../Stores/ProductStore.js';
import { useFillInventoryStates } from '../../Hooks/FillStates.js';
function HomePage() {
  //Destructure
  const { FillInventoryStates } = useFillInventoryStates();
  useEffect(() => {
    FillInventoryStates()
  } , [])
  return (
    <div className = {Styles['Main-Div']}>
      <div className = {Styles['Content-Div']}>
        <TopBar />
        <PageHolder />
      </div>
    </div>
  )
}

export default HomePage