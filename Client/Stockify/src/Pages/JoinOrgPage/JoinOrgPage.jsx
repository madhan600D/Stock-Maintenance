import React, { useEffect, useRef, useState } from 'react'
import Styles from './JoinOrgPage.module.css'

//Components
import FormComponent from '../Components/FormComponent/FormComponent'
import PageSelector from '../Components/PageSelector/PageSelector'
import TextBoxWithLogo from '../Components/TextBoxWithLogo/TextBoxWithLogo';
import ShowToast from '../Components/Toast/Toast.js'
import SideBar from '../Components/SideBar/SideBar.jsx'

//Logos
import { IoQrCodeOutline } from "react-icons/io5";
import { IoSearchCircle } from "react-icons/io5";

//Hooks


//Store
import useOrg from '../../Stores/OrgStore';
import PageSuspense from '../Components/Suspense Components/PageSuspense/PageSuspense';
import TypingSuspense from '../Components/Suspense Components/TypingSuspense/TypingSuspense';
import ItemAdder from '../Components/ItemAdder/ItemAdder.jsx';
import SearchBox from '../Components/SearchBox/SearchBox.jsx';

function JoinOrgPage() {
    //Login: Code , SignUp: Refferal
    const [CurrentPage , SetCurrentPage] = useState("Login");
    const [FormData , SetFormData] = useState({JoinMethod:"" ,OrganizationJoiningCode:"" , OrganizatinName:""})
    const [OTP , SetOTP] = useState();
    const OTPRef = useRef();
    //Store
    const {IsJoiningOrg , JoinOrg , GetAllOrganizations , AllOrganizations} = useOrg()

    //UseEffect to set The current page
    useEffect(() => {
        SetFormData((Prev) => ({...Prev , JoinMethod: CurrentPage === "Login" ? "referral" : "request"}))
    } , [CurrentPage])

    useEffect( () => {
        const GetOrgs = async() =>{
            await GetAllOrganizations()
        }   
        GetOrgs()
    } , [])
    

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
        SetCurrentPage(CurrentPage === "Login" ? "SignUp" : "Login")
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
            <SearchBox 
            Data={AllOrganizations}
            MaxItems={3}
            InitialFocus={true}
            PlaceHolder='Enter the org name to join ...'
            Logo={IoSearchCircle}
            ColorPallete={["red" , "red"]}
            DataType={"STRING"}
            FilterType={"InitialString"}
            OnSelection={() => {console.log("On selection called")}}
            />
        </div> 
        }
        </div>
    </div>
  )
}
export default JoinOrgPage