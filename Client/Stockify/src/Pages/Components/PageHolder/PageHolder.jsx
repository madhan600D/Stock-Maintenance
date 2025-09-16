import React from 'react'
import Styles from './PageHolder.module.css'

import useApp from '../../../Stores/AppStore.js';

//Components
import TopBar from '../TopBar/TopBar.jsx'
function PageHolder() {
  const {CurrentPage} = useApp();
  return (
    <div className={Styles['Main-Div']}>
        <div className='Page-Div'>
          {CurrentPage === '' ? "Welcome to home page" : <CurrentPage />}
        </div>
    </div>
  )
}

export default PageHolder