import React, { useEffect, useRef, useState } from 'react'
import Styles from './LoginPage.module.css'

//Components
import TextBoxWithLogo from '../Components/TextBoxWithLogo/TextBoxWithLogo.jsx'
import PageSelector from '../Components/PageSelector/PageSelector.jsx';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CheckerComponent from '../Components/CheckerComponent/CheckerComponent.jsx';
import TextBoxWithSwitchButton from '../Components/TextBoxWithSwitchButton/TextBoxWithSwitchButton.jsx';
import FallBackSpinner from '../Components/Suspense Components/FallBackSpinner/FallBackSpinner.jsx';

//Icons
import { FaUser , FaLock , FaEye } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { RiMailSendFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { FaUserAltSlash } from "react-icons/fa";

//Images
import WareHouse from '../../assets/BackGroundImages/WareHouse.jpg'
import TextBoxWithButton from '../Components/TextBoxWithButton/TextBoxWithButton.jsx';

//Stores
import useUser from '../../Stores/UserStore.js';
import ShowToast from '../Components/Toast/Toast.js';
import UseProduct from '../../Stores/ProductStore.js';

const LoginPage = () => {

  //Hooks
  const [CurrentPage , SetCurrentPage] = useState('Login');
  const [FormData , SetFormData] = useState({userName:'' , userMail:'' , password:'' , confirmPassword:'' , closeSession:false });
  const [KillSession , SetKillSession] = useState(false);
  const UserNameRef = useRef();
  const UserMailRef = useRef();
  const PasswordRef = useRef();
  const ConfirmPasswordRef = useRef();

  //Destructure
  const {SignUp , AddUser , Login , IsSignUpLoading , IsAddUserLoading , IsLoginLoading , OrganizationData} = useUser();
  const navigate = useNavigate();

  //Functions
  const HandlePageChange = async (Param) => {
    SetCurrentPage(Param)
  }
  const HandleEmailVerificationButtonClick = async () => {
    const res = await SignUp(FormData)
    ShowToast(res.success , res.message)
  }
  const HandleKillSessionButtonClick = async () => {
    if(KillSession){
      SetKillSession(false)
      FormData.closeSession = false
    }
    else{
      SetKillSession(true)
      FormData.closeSession = true
    }
  }
  
  const HandleLoginClick = async (Param) => {
    const IsLogin = await Login(FormData);
    ShowToast(IsLogin.success , IsLogin.message);
    if(IsLogin.success){
      //Route to join org page
      if(IsLogin.data.data.OrganizationID == 1){
        navigate('/create-join-org');
      }
      else{
        //TBD:Navigate to home page
        
        navigate('/home');
      }
    } 
    }

  const HandleTextBoxChange = async () => {
    SetFormData({userName:UserNameRef.current?.value , userMail:UserMailRef.current?.value , password:PasswordRef.current?.value , confirmPassword:ConfirmPasswordRef.current?.value});
  }

  const HandleSignUpClick = async () => {
    //Backend Call
    const res = await AddUser(FormData)
    if(res.success){
      ShowToast(true , res.message);
      navigate('/create-join-org')
    }
    else{
      ShowToast(true , res.message);
    } 

  }
  if(CurrentPage === 'Login'){
    return (
      //Login Page
      <div className = {Styles['Main-Div']}>
        <div className = {Styles['LeftSide-Div']}>
          <img src = {WareHouse} className = {Styles['WareHouse-Img']}/>
        </div>
        <div className = {Styles['RightSide-Div']}>
          <div className = {Styles['CompanyInfo-Div']}>
            <p style={{margin:"1.1rem"}}>
              E-Nventory
            </p>
            <p style={{fontSize:"1rem" , margin:"0"}}>
              Manage your company's inventory smartly
            </p>
          </div>
          <div className = {Styles['Form-Div']}>
            <PageSelector
              CurrentPage={CurrentPage}
              SetCurrentPage={SetCurrentPage}
              PageHeader={["LOGIN" , "SIGN UP"]}
            />
            <div className = {Styles['TextBox-Div']}>
              <TextBoxWithLogo
              Logo={FaUser}
              ButtonLogo={[FaUser , FaUserAltSlash]}
              IsMandatory={false}
              FloatingText={"USER NAME / E-MAIL"}
              Type={"STRING"}
              TBCallBack={HandleTextBoxChange}
              Reference={UserNameRef}
              ColorPallete={["#3fb1d5" , "#4085badf"]}
            />
            
              <TextBoxWithButton 
              Logo={FaLock}
              ButtonLogo={FaEye}
              IsMandatory={false}
              FloatingText={"PASSWORD"}
              IsSuspense={false}
              TBCallBack={HandleTextBoxChange}
              Type={"STRING"}
              Reference={PasswordRef}
              ColorPallete={["#d53f3fff" , "#ff7e7ee7"]}
            />
          </div>
          <div className = {Styles['LoginButton-Div']} onClick={() => {HandleLoginClick()}}>
            {IsLoginLoading ? <FallBackSpinner /> : CurrentPage.toUpperCase()}
          </div>
          <div className = {Styles['SignUpPageSwitch-Div']}>
            <p className = {Styles['Info-Lbl']}>
              Don't have a account ?
            </p>
            <p style={{color:"#e1c9c9c7"}} className = {Styles['SignUpPageSwitch-Lbl']} onClick={() => HandlePageChange('SignUp')}>
              SIGN UP
            </p>
          </div>
          
        </div>
      </div>
      <ToastContainer />
    </div>
  )
  }
  //Sign Up Page
  else{
    return(
        <div className = {Styles['Main-Div']}>
          <div className = {Styles['LeftSide-Div']}>
            <img src = {WareHouse} className = {Styles['WareHouse-Img']}/>
          </div>
          <div className = {Styles['RightSide-Div']}>
            <div className = {Styles['CompanyInfo-Div']}>
              <p style={{margin:"1.1rem"}}>
                E-Nventory
              </p>
              <p style={{fontSize:"1rem" , margin:"0"}}>
                Manage your company's inventory smartly
              </p>
            </div>
            <div className = {Styles['Form-Div']}>
              <PageSelector
                CurrentPage={CurrentPage}
                SetCurrentPage={SetCurrentPage}
                PageHeader={["LOGIN" , "SIGN UP"]}
              />
              <div className = {Styles['TextBox-Div']}>
                <TextBoxWithLogo 
                Logo={FaUser}
                IsMandatory={false}
                FloatingText={"USER NAME"}
                Type={"STRING"}
                TBCallBack={HandleTextBoxChange}
                Reference={UserNameRef}
                IsLoading={IsSignUpLoading}
                ColorPallete={["#3fb1d5" , "#4085badf"]}
              />
              <TextBoxWithButton 
                Logo={IoIosMail}
                ButtonLogo={RiMailSendFill}
                IsMandatory={false}
                FloatingText={"E-Mail"}
                Type={"STRING"}
                TBCallBack={HandleTextBoxChange}
                IsSuspense={IsSignUpLoading}
                ButtonCallBack={HandleEmailVerificationButtonClick}
                Reference={UserMailRef}
                ColorPallete={["#d5a33fff" , "#ffa37ee7"]}
              />
              <TextBoxWithButton 
                Logo={FaLock}
                ButtonLogo={FaEye}
                IsMandatory={false}
                FloatingText={"PASSWORD"}
                IsSuspense={false}
                TBCallBack={HandleTextBoxChange}
                Type={"STRING"}
                Reference={PasswordRef}
                ColorPallete={["#d53f3fff" , "#ff7e7ee7"]}
              />
              <TextBoxWithLogo 
                Logo={FaLock}
                IsMandatory={false}
                FloatingText={"CONFIRM PASSWORD"}
                TBCallBack={HandleTextBoxChange}
                Type={"STRING"}
                IsLoading={IsSignUpLoading}
                Reference={ConfirmPasswordRef}
                ColorPallete={["#d53f3fff" , "#ff7e7ee7"]}
              />
            </div>
            <div className = {Styles['LoginButton-Div']} onClick={() => HandleSignUpClick()}>
              
              {CurrentPage.toUpperCase()}
            </div>
            <div className = {Styles['SignUpPageSwitch-Div']}>
              <p className = {Styles['Info-Lbl']}>
                Thanks for signing up ...!
              </p>
            </div>
            
          </div>
        </div>
        <ToastContainer />
      </div>    
    )
  }

  
}

export default LoginPage