import React from 'react';
import Styles from './HomePage.module.css';

//Components
import TopBar from '../Components/TopBar/TopBar.jsx';
import PageHolder from '../Components/PageHolder/PageHolder.jsx';


function HomePage() {
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