import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Styles from './ProfilePage.module.css'

//Images
import DefaultProfile from '../../../assets/Resource/DefaultImage.png'
import useOrg from '../../../Stores/OrgStore';
import useUser from '../../../Stores/UserStore';
import useApp from '../../../Stores/AppStore';

//Components
import Tooltip from '@mui/material/Tooltip';
import SimpleButton from '../../Components/SimpleButton/SimpleButton';
import TextBoxWithButton from '../../Components/TextBoxWithButton/TextBoxWithButton';
import ShowToast from '../../Components/Toast/Toast';

//Logos
import { BiSolidCamera } from 'react-icons/bi';
import { GoOrganization } from 'react-icons/go';
import { BiLock } from 'react-icons/bi';
import { CgPassword } from 'react-icons/cg';
import { MdPassword } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BarChart from '../../Components/Graphs/BarChart/BarChart';

function ProfilePage() {
   //Stores
  const {UserData , CurrentRole , GetRole , UpdateProfile} = useUser();
  const {OrganizationData , LeaveOrganization} = useOrg()
  const {SetCurrentPage} = useApp();

  //States
  const [CurrentPassword , SetCurrentPassword] = useState({OldPassword:'' , NewPassword:'' , ConfimPassword:''});

  //Refs
  const ProfileImageEditRef  = useRef();
  const OldPasswordRef = useRef();
  const NewPasswordRef = useRef();
  const ConfirmPasswordRef = useRef();

  const navigate = useNavigate()

  useEffect(() => {
    GetRole()
  } , [])

  const ProfileInitState = {
    CurrentProfile: UserData.ProfilePic || DefaultProfile,
    Passwords: { OldPassword: "", NewPassword: "", ConfirmPassword: "" },
    Changes: new Map()
};
  const HandleImageUpload = (e) => {
      const File = e.target.files[0];
      const Reader = new FileReader();
      
      Reader.onload = async () => {
        const Base64ofFile = Reader.result;
        
        Dispatch({type:ProfileActions.CHANGE_PROFILE_IMAGE , payload:Base64ofFile})
      };

      Reader.readAsDataURL(File); 

    };

    const ProfileActions = Object.freeze({
      CHANGE_PASSWORD : "CHANGE_PASSWORD",
      CHANGE_PROFILE_IMAGE: "CHANGE_PROFILE_IMAGE",
      CONFIRM_ACTION:"CONFIRM_ACTION"
    })
    const ValidatePassword = () =>{
      try {
        if(ProfileState.Passwords.NewPassword?.length < 8 || ProfileState.Passwords?.OldPassword?.length < 8){
          return false
        }
        if(ProfileState.Passwords.NewPassword !== ProfileState.Passwords.ConfimPassword){
          ShowToast(false , "New and Confirm password should be same.")
          return false
        }

        return true;
      } catch (error) {
        console.log(error)
      }
    }
     // Reducer function
  function ProfileReducer(state, action) {
    const newState = { ...state };

    switch (action.type) {
      case ProfileActions.CHANGE_PROFILE_IMAGE:
        newState.CurrentProfile = action.payload;
        newState.Changes.set(ProfileActions.CHANGE_PROFILE_IMAGE, action.payload);
        return newState;

      case ProfileActions.CHANGE_PASSWORD:
        const IsSuccess = ValidatePassword()
        if(!IsSuccess){
          return newState;
        }
        newState.Passwords = action.payload;
        newState.Changes.set(ProfileActions.CHANGE_PASSWORD, action.payload.ConfirmPassword);
        return newState;

      default:
        return state;
    }
  }

    const [ProfileState , Dispatch] = useReducer(ProfileReducer , ProfileInitState);
    const ConfirmUpdate = async () => {
      try {
        const IsSuccess = await UpdateProfile(ProfileState.Changes); 
        ShowToast(IsSuccess.success , IsSuccess.message); 
        return
      } catch (error) {
        console.log(error)
      }
    }
    async function HandleLeaveOrganization(){
      try {
        const res = await LeaveOrganization()
        
        if(res.success){
            ShowToast(res.success , res.message);
            navigate('../create-join-org')
        }
        else{
          ShowToast(res.success , res.message);
        }
          
      } catch (error) {
        ShowToast(false , error)
      }
    }
  return (
    <div className = {Styles['Main-Div']}>
      <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1rem' , gap:'0.6rem' ,    backgroundColor:'#1E232B' , padding:'0.3rem' , borderRadius:'10px' ,width:'30%' , marginBottom:'2rem'}}>
                <GoOrganization />
                <label className={Styles['Styled-Label']}>Edit Profile</label>
      </div>
      <div className = {Styles['Top-Div']}>
            <div className={Styles['ImageEdit-Div']}>
              <img className= {Styles['Profile-Img']} src = {ProfileState.CurrentProfile} alt='Image Not Found..!' />
                  <BiSolidCamera type='file' onClick={() => {ProfileImageEditRef.current.click()}} className= {Styles['ImageUpload-Button']}/>
              
                <input type='file' accept='image/*'  onChange={(Event) => HandleImageUpload(Event)} style={{display:'none'}} ref={ProfileImageEditRef} />
                <div className={Styles['VerticalAlign']}>
                <label className={Styles['UserName-Lbl']}>{UserData.UserName.toUpperCase()}</label>
                <label className={Styles['UserName-Lbl']} style={{color:'rgba(157, 157, 157, 0.69)'}}>{UserData.UserMail}</label>
              </div>
      </div>
      </div>
      <div className = {Styles['Mid-Div']}>
          <div className = {Styles['Password-Div']}>  

          </div>
          <div className = {Styles['Organization-Div']}>
            <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1rem' , gap:'0.6rem' ,    backgroundColor:'#1E232B' , padding:'0.3rem' , borderRadius:'10px'}}>
                <GoOrganization />
                <label className={Styles['Styled-Label']}>Organization Info</label>
              </div>
              <div style={{display:'flex' , width:'100%' , justifyContent:'space-between' , marginTop:'1rem'}}>
                  <label className={Styles['UserName-Lbl']}>Organization Name :</label>
                  <label className={Styles['UserName-Lbl']}>{OrganizationData && OrganizationData[0] && OrganizationData[0][0].OrganizationName}</label>
              </div>
              <div style={{display:'flex' , width:'100%' , justifyContent:'space-between' , marginTop:'1rem'}}>
                  <label className={Styles['UserName-Lbl']}>Role:</label>
                  <label className={Styles['UserName-Lbl']}>{CurrentRole ? CurrentRole : 'NA'}</label>
              </div>
              <div style={{marginTop:'1rem' , width:'100%' , display:'flex' , justifyContent:'end'}}>
                  <SimpleButton 
                    ButtonText={'LEAVE ORGANIZATION'}
                    Dimensions={['100%']}
                    BGColor={'red'}
                    Callback={() => {HandleLeaveOrganization()}}
                  />
                  
              </div>
              <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1rem' , gap:'0.6rem' ,    backgroundColor:'#1E232B' , padding:'0.3rem' , borderRadius:'10px'}}>
                <BiLock />
                <label className={Styles['Styled-Label']}>Security</label>
              </div>
              <div style={{display:'flex' , width:'100%' , justifyContent:'space-between' , marginTop:'2rem'}}>
                  <label className={Styles['UserName-Lbl']}>Old Password: </label>
                  <TextBoxWithButton
                    Logo={MdPassword}
                    ButtonLogo={FaEye}
                    FloatingText={"Old Password"}
                    Reference={OldPasswordRef}
                    Type={'STRING'}
                    Width='70%'
                    TBCallBack={() => {Dispatch({type: ProfileActions.CHANGE_PASSWORD, payload: {...ProfileState.Passwords,OldPassword: OldPasswordRef.current?.value}})}}

                    ButtonCallBack={() => {console.log("Test")}}
                    ColorPallete={['red' , '#a20500aa']}
                  />
              </div>
              <div style={{display:'flex' , width:'100%' , justifyContent:'space-between' , marginTop:'2rem'}}>
                  <label className={Styles['UserName-Lbl']}>New Password: </label>
                  <TextBoxWithButton
                    Logo={MdPassword}
                    ButtonLogo={FaEye}
                    Width='70%'
                    FloatingText={"New Password"}
                    Reference={NewPasswordRef}
                    Type={'STRING'}

                    TBCallBack={() => {Dispatch({type: ProfileActions.CHANGE_PASSWORD, payload: {...ProfileState.Passwords,NewPassword: NewPasswordRef.current?.value}})}}

                    ButtonCallBack={() => {console.log("Test")}}
                    ColorPallete={['red' , '#a20500aa']}
                  />
              </div>
              <div style={{display:'flex' , width:'100%' , justifyContent:'space-between' ,alignItems:'center' ,borderBottom:'1px solid white' , marginTop:'2rem' , paddingBottom:'2rem'}}>
                  <label className={Styles['UserName-Lbl']}>Confirm Password: </label>
                  <TextBoxWithButton
                    Logo={MdPassword}
                    ButtonLogo={FaEye}
                    Reference={ConfirmPasswordRef}
                    FloatingText={"Confirm Password"}
                    Type={'STRING'}
                    Width='70%'

                    TBCallBack={() => {Dispatch({type: ProfileActions.CHANGE_PASSWORD, payload: {...ProfileState.Passwords,CurrentPassword: OldPasswordRef.current?.value}})}}

                    ButtonCallBack={() => {console.log("Test")}}
                    ColorPallete={['red' , '#a20500aa']}
                  />
              </div>
              <div style={{display:'flex' , width:'100%' , justifyContent:'center' , marginTop:'2rem'}}>
                <SimpleButton 
                    ButtonText={'UPDATE PROFILE'}
                    Dimensions={['100%']}
                    BGColor={'rgba(0, 109, 22, 0.67)'}
                    Callback={() => {ConfirmUpdate(ProfileState.Changes)}}
                  />
              </div>
              
          </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProfilePage