import React, { useEffect, useRef, useState } from 'react'
import Styles from './JoinOrgPage.module.css'

//Components
import FormComponent from '../Components/FormComponent/FormComponent'
import PageSelector from '../Components/PageSelector/PageSelector'
import TextBoxWithLogo from '../Components/TextBoxWithLogo/TextBoxWithLogo';
import ShowToast from '../Components/Toast/Toast.js'

//Logos
import { IoQrCodeOutline } from "react-icons/io5";

//Hooks


//Store
import useOrg from '../../Stores/OrgStore';
import PageSuspense from '../Components/Suspense Components/PageSuspense/PageSuspense';
import TypingSuspense from '../Components/Suspense Components/TypingSuspense/TypingSuspense';
import ItemAdder from '../Components/ItemAdder/ItemAdder.jsx';
function JoinOrgPage() {
    //Login: Code , SignUp: Refferal
    const [CurrentPage , SetCurrentPage] = useState("Login");
    const [FormData , SetFormData] = useState({JoinMethod:"" ,OrganizationJoiningCode:"" , OrganizatinName:""})
    const [OTP , SetOTP] = useState();
    const OTPRef = useRef();

    //UseEffect to set The current page
    useEffect(() => {
        SetFormData((Prev) => ({...Prev , JoinMethod: CurrentPage === "Login" ? "Code" : "request"}))
    } , [CurrentPage])
    //Store
    const {IsJoiningOrg , JoinOrg} = useOrg()

    //functions
    const HandleSubmitButtonClick = async () =>{
        const IsSuccess = await JoinOrg(FormData)
        if(IsSuccess.success){
            ShowToast()
        }
        else{

        }
    }
    const HandleTextBoxChange = async () => {
        SetFormData((Prev) => ({...Prev , OrganizationJoiningCode:OTPRef.current.value}));
    }

    const HandlePageChange = async () => {
        SetCurrentPage(CurrentPage === "Login" ? "Sign up" : "Login")
    }
  return (
    <div className= {Styles["Main-Div"]}>
        <div className= {Styles["Form-Div"]}>
            <PageSelector 
            PageHeader={["Join with Code" , "Send Request"]}
            CurrentPage = {CurrentPage}
            SetCurrentPage={HandlePageChange}
            />
        {CurrentPage == "Login" ? IsJoiningOrg ? <PageSuspense /> : 
        //Render Code
        (
            <div className= {Styles["Page-Div"]}>
                <TextBoxWithLogo 
                    className = {Styles['OTP-Txt']}
                    Logo={IoQrCodeOutline}
                    FloatingText={"OTP"}
                    Reference={OTPRef}
                    TBCallBack={HandleTextBoxChange}
                    IsMandatory={false}
                    Type={"STRING"}
                    ColorPallete={["red" , "brown"]}
                    IsLoading={false}
                    />
                <button className = {Styles['Submit-Btn']} onClick={() => {HandleSubmitButtonClick()}}>VALIDATE
                </button>
                <label className = {Styles['Code-Lbl']}>
                    A OTP would have been sent to your Email by the Organanization Admin, Please enter the 6 digit code above to join the Organization.
                </label>
                
            </div>
        ) 
        
        
        :<div className= {Styles["Page-Div"]}>
            <ItemAdder 
                ButtonText={"ADD"}
            />
        </div> 
        }
        </div>
    </div>
  )
}

export default JoinOrgPage