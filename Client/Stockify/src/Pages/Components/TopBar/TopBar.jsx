import React from 'react'
import Styles from './TopBar.module.css'

//Components
import DateTimeDisplay from '../DateTimeDisplay/DateTimeDisplay.jsx'
import EnventoryLogo from '../EnventoryLogo/EnventoryLogo.jsx'

//Images
import DefaultProfile from '../../../assets/Resource/DefaultImage.png'

//Stores
import useUser from '../../../Stores/UserStore.js';
function TopBar() {
  //Stores
  const {UserData} = useUser();
  return (
    <div className={Styles['Main-Div']}>
        <DateTimeDisplay />
        <EnventoryLogo />
        <div className= {Styles['User-Div']}>
          <div className={Styles['Profile-Div']}>
            <img className={Styles['Profile-Img']} src = {DefaultProfile}/>
          </div>
          <div className={Styles['VerticalAlign']}>
              <label className={Styles['UserName-Lbl']}>{UserData.UserName.toUpperCase()}</label>
              <label className={Styles['UserName-Lbl']}>{UserData.UserMail}</label>
            </div>
        </div>
    </div>
  )
}

export default TopBar