import React, { useEffect, useRef, useState } from 'react'
import Styles from './LoginPage.module.css'

//Components
import TextBoxWithLogo from '../Components/TextBoxWithLogo/TextBoxWithLogo.jsx'
import PageSelector from '../Components/PageSelector/PageSelector.jsx';
import { ToastContainer } from 'react-toastify';

//Icons
import { FaUser , FaLock , FaEye } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { RiMailSendFill } from "react-icons/ri";
//Images
import WareHouse from '../../assets/BackGroundImages/WareHouse.jpg'
import TextBoxWithButton from '../Components/TextBoxWithButton/TextBoxWithButton.jsx';

//Stores
import useUser from '../../Stores/UserStore.js';
import ShowToast from '../Components/Toast/Toast.js';
const LoginPage = () => {

  //Hooks
  const [CurrentPage , SetCurrentPage] = useState('Login');
  const [FormData , SetFormData] = useState({UserName:'' , UserMail:'' , Password:'' , ConfirmPassword:'' });
  const UserNameRef = useRef();
  const UserMailRef = useRef();
  const PasswordRef = useRef();
  const ConfirmPasswordRef = useRef();

  //Destructure
  const {SignUp} = useUser();

  //Functions
  const HandlePageChange = async (Param) => {
    ShowToast(true , "Test")
    SetCurrentPage(Param)
  }
  const HandleEmailVerificationButtonClick = async () => {
    const res = await SignUp(FormData)
    ShowToast(res.success , res.message)


  }
  const HandleLoginClick = async (Param) => {

  }

  const HandleTextBoxChange = async () => {
    SetFormData({userName:UserNameRef.current?.value , userMail:UserMailRef.current?.value , password:PasswordRef.current?.value , confirmPassword:ConfirmPasswordRef.current?.value});
  }

  const HandleSignUpClick = async () => {
    //Backend Call
    SetFormData({UserName:UserNameRef.current.value , UserMail:UserMailRef.current.value , Password:PasswordRef.current.value , ConfirmPassword:ConfirmPasswordRef.current?.value})
    console.log(FormData)

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
            />
            <div className = {Styles['TextBox-Div']}>
              <TextBoxWithLogo 
              Logo={FaUser}
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
              TBCallBack={HandleTextBoxChange}
              Type={"STRING"}
              Reference={PasswordRef}
              ColorPallete={["#d53f3fff" , "#ff7e7ee7"]}
            />
          </div>
          <div className = {Styles['LoginButton-Div']}>
            {CurrentPage.toUpperCase()}
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
              />
              <div className = {Styles['TextBox-Div']}>
                <TextBoxWithLogo 
                Logo={FaUser}
                IsMandatory={false}
                FloatingText={"USER NAME"}
                Type={"STRING"}
                TBCallBack={HandleTextBoxChange}
                Reference={UserNameRef}
                ColorPallete={["#3fb1d5" , "#4085badf"]}
              />
              <TextBoxWithButton 
                Logo={IoIosMail}
                ButtonLogo={RiMailSendFill}
                IsMandatory={false}
                FloatingText={"E-Mail"}
                Type={"STRING"}
                TBCallBack={HandleTextBoxChange}
                ButtonCallBack={HandleEmailVerificationButtonClick}
                Reference={UserMailRef}
                ColorPallete={["#d5a33fff" , "#ffa37ee7"]}
              />
              <TextBoxWithButton 
                Logo={FaLock}
                ButtonLogo={FaEye}
                IsMandatory={false}
                FloatingText={"PASSWORD"}
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