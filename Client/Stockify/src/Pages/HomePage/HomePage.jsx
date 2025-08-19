import React from 'react';
import Styles from './HomePage.module.css';

//Components
import SideBar from '../Components/SideBar/SideBar';

function HomePage() {
  return (
    <div className = {Styles['Main-Div']}>
      <SideBar />
      <div className = {Styles['Content-Div']}>
        test
      </div>
    </div>
  )
}

export default HomePage