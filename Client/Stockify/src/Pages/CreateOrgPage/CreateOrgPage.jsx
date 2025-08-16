import React, { useEffect, useRef, useState } from 'react'
import Styles from './CreateOrgPage.module.css'
import TextBoxWithLogo from '../Components/TextBoxWithLogo/TextBoxWithLogo.jsx'
//Components
import FormComponent from '../Components/FormComponent/FormComponent.jsx' 
import { ToastContainer } from 'react-toastify';
import FallBackSpinner from '../Components/Suspense Components/FallBackSpinner/FallBackSpinner.jsx';
import ShowToast from '../Components/Toast/Toast.js';

//Logos
import { FaBuilding } from "react-icons/fa";
import { MdBusinessCenter } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { FaCity } from "react-icons/fa";
import { IoFlagSharp } from "react-icons/io5";
import { TbNumbers } from "react-icons/tb";
import { LiaCommentSolid } from "react-icons/lia";

//Stores
import useOrg from '../../Stores/OrgStore.js';

function CreateOrgPage() {
  //Hooks
  const [FormData, SetFormData] = useState({});
  const [TextBoxes, SetTextBoxes] = useState({});
  const OrganizationNameRef = useRef();
  const BusinessTypeRef = useRef();
  const StreetRef = useRef();
  const CityRef = useRef();
  const CountryRef = useRef();
  const PinCodeRef = useRef();
  const DescriptionRef = useRef();

  //Destructure
  const {IsCreateOrgLoading , CreateOrg , OrganizationData} = useOrg();
  const HandleTextBoxChange = () => {
    SetFormData({
      OrganizationName: OrganizationNameRef.current?.value , BusinessType:BusinessTypeRef.current?.value , Street:StreetRef.current?.value , City:CityRef.current?.value , Country:CountryRef.current?.value , PinCode:PinCodeRef.current?.value
    });
  };
  useEffect(() => {
    SetTextBoxes(Prev => ({"Basic Details":[<TextBoxWithLogo
        Logo={FaBuilding}
        IsMandatory={false}
        FloatingText="Organization Name"
        Type="STRING"
        Reference={OrganizationNameRef}
        ColorPallete={["#145beb", "#148aebff"]}
        TBCallBack={HandleTextBoxChange}
      />,
      <TextBoxWithLogo
        Logo={MdBusinessCenter}
        IsMandatory={false}
        FloatingText="Business Type"
        Type="STRING"
        Reference={BusinessTypeRef}
        ColorPallete={["#eb7514ff", "#eb6614ff"]}
        TBCallBack={HandleTextBoxChange}
      />],
      "Address":[<TextBoxWithLogo
        Logo={FaHouse}
        IsMandatory={false}
        FloatingText="Street"
        Type="STRING"
        Reference={StreetRef}
        ColorPallete={["#448102ff", "#29451cff"]}
        TBCallBack={HandleTextBoxChange}
      /> , 
      <TextBoxWithLogo
        Logo={FaCity}
        IsMandatory={false}
        FloatingText="City"
        Type="STRING"
        Reference={CityRef}
        ColorPallete={["#980000ff", "#6c2a21ff"]}
        TBCallBack={HandleTextBoxChange}
      /> ,
      <TextBoxWithLogo
        Logo={IoFlagSharp}
        IsMandatory={false}
        FloatingText="Country"
        Type="STRING"
        Reference={CountryRef}
        ColorPallete={["#009863ff", "#2d5f4fff"]}
        TBCallBack={HandleTextBoxChange}
      /> , 
      <TextBoxWithLogo
        Logo={TbNumbers}
        IsMandatory={false}
        FloatingText="Pin Code"
        Type="INTEGER"
        Reference={PinCodeRef}
        ColorPallete={["#a0a0a0ff", "#000000ff"]}
        TBCallBack={HandleTextBoxChange}
      />] , 
      "Description":[<TextBoxWithLogo
        Logo={LiaCommentSolid}
        IsMandatory={false}
        FloatingText="Description"
        Type="INTEGER"
        Reference={DescriptionRef}
        ColorPallete={["#3c3c3cff", "#7e7e7eff"]}
        TBCallBack={HandleTextBoxChange}
      />]})
      
  );
  }, []);
  const HandleSubmitButtonClick = async () => {
    const NewOrganizationCreated = await CreateOrg(FormData) ; 
    if(NewOrganizationCreated.success){
      ShowToast(true , NewOrganizationCreated.message);
      //Route to Invite Page
    }
    else{
      ShowToast(false , NewOrganizationCreated.message);
    }
  }
  return (
    <>
      <div className={Styles["Main-Div"]}>
        <FormComponent 
        Inputs={TextBoxes} 
        LoadingState={true}
        LoadingComponent={FallBackSpinner}
        BtnCallBack={HandleSubmitButtonClick}
        />
    </div>
    <ToastContainer />
    </>
    
  );
}
export default CreateOrgPage