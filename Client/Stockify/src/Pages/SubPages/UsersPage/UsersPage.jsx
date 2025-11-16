import React, { useEffect, useState } from 'react'
import Styles from './UsersPage.module.css'

//Logos
import { HiUserGroup } from "react-icons/hi2";

//Stores
import useOrg from '../../../Stores/OrgStore';

//Modules
import { StateToTable } from '../../../Utils/QueryToObject.js';

//Components
import Table from '../../Components/Table/Table.jsx'

//image
import DefaultImage from '../../../assets/Resource/DefaultImage.png'
function UsersPage() {
    const [UserData , SetUserData] = useState();

    //Stores
    const {Users} = useOrg();
    //Effects
    useEffect(() => {
            const table =  StateToTable(Users, {} , ['userId' , 'profilePic', 'userName' , 'role' ,'userMail']); 

            //Sub Profile with Img
            for(let Value of table.Rows){
                Value[1] = Value[1] === '' ? <img className= {Styles['Profile-Img']} src={DefaultImage} alt='Profile Image Load Failed' /> : <img className= {Styles['Profile-Img']} src={Value[1]} alt='Profile Image Load Failed' />
            }
            SetUserData(table);
    } , [Users])
  return ( 
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['Top-Div']}>
            {/* About this page details */}
            <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                <HiUserGroup />
                <label className={Styles['Styled-Label']}>Users</label>
            </div>
        </div>
        <div className = {Styles['Mid-Div']}>
            {UserData && (
                <Table 
                    TableName={'Users'}
                    TableArg={UserData}
                    DisplayOptions = {false}
                    Dimensions={['100%' , 'auto']}
                />
            )}
        </div>
    </div>
  )
}

export default UsersPage