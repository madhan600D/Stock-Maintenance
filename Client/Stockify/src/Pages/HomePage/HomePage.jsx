import React, { useEffect } from 'react';
import Styles from './HomePage.module.css';

//Components
import TopBar from '../Components/TopBar/TopBar.jsx';
import PageHolder from '../Components/PageHolder/PageHolder.jsx';

//Stores
import UseProduct from '../../Stores/ProductStore.js';
import useUser from '../../Stores/UserStore.js';
import { useFillInventoryStates } from '../../Hooks/FillStates.js';
import { ToastContainer } from 'react-toastify';
import ShowToast from '../Components/Toast/Toast.js';
function HomePage() {
  //Destructure
  const { FillInventoryStates } = useFillInventoryStates();
  const {DeInitInventorySocketEvents} = UseProduct();
  const {LastSocketMessage , SocketState} = useUser();
  useEffect(() => {
    FillInventoryStates()

    // return DeInitInventorySocketEvents()
  } , [])

  //Effect which displayes SocketMessages
  useEffect(() => {
    ShowToast(true , LastSocketMessage);
  } , [LastSocketMessage])
  return (
    <div className = {Styles['Main-Div']}>
      <div className = {Styles['Content-Div']}>
        <TopBar />
        <PageHolder />
      </div>
      <ToastContainer />
    </div>
  )
}

export default HomePage