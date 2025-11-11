import React from 'react'
import Styles from './TopBar.module.css'

//Components
import DateTimeDisplay from '../DateTimeDisplay/DateTimeDisplay.jsx'
import EnventoryLogo from '../EnventoryLogo/EnventoryLogo.jsx'
import Tooltip from '@mui/material/Tooltip';

//Images
import DefaultProfile from '../../../assets/Resource/DefaultImage.png'

//Stores
import useUser from '../../../Stores/UserStore.js';
import useOrg from '../../../Stores/OrgStore.js';
import useApp from '../../../Stores/AppStore.js';
function TopBar() {
  //Stores
  const {UserData} = useUser();
  const {OrganizationData} = useOrg()
  const {SetCurrentPage} = useApp();
  return (
    <div className={Styles['Main-Div']}>
        <DateTimeDisplay />
        <div>
          <EnventoryLogo />
          <label className = {Styles['Special-Label']}>{OrganizationData && OrganizationData.OrganizationName}</label>
        </div>
        
        <Tooltip arrow title='Edit Profile'>
            <div className= {Styles['User-Div']} onClick={() => {SetCurrentPage('/profile')}}>
              <div className={Styles['Profile-Div']}>
                <img className={Styles['Profile-Img']} src = {UserData.ProfilePic || DefaultProfile}/>
              </div>
              <div className={Styles['VerticalAlign']}>
                  <label className={Styles['UserName-Lbl']}>{UserData.UserName.toUpperCase()}</label>
                  <label className={Styles['UserName-Lbl']}>{UserData.UserMail}</label>
                </div>
        </div>
        </Tooltip>
        
    </div>
  )
}

export default TopBar