import React, { useEffect, useRef, useState } from 'react'
import Styles from './OrganizationPage.module.css'

//Icons
import { BsBuildingFill } from "react-icons/bs";
import { StateToTable } from '../../../Utils/QueryToObject';
import { HiMiniMegaphone } from "react-icons/hi2";
import { CiShare2 } from "react-icons/ci";

//Stores
import useOrg from '../../../Stores/OrgStore';

//Components
import Table from '../../Components/Table/Table.jsx'
import DialButton from '../../Components/DialButton/DialButton.jsx';
import InviteToOrgPage from '../InviteToOrgPage/InviteToOrgPage.jsx';
import TextBoxWithLogo from '../../Components/TextBoxWithLogo/TextBoxWithLogo.jsx';
function OrganizationPage() {
    const [ShowInviteDiv , SetShowInviteDiv] = useState(false);
    const [OrganizationDataState , SetOrganizationDataState] = useState();
    const [PNLData , SetPNLData] = useState();
    const {OrganizationData} = useOrg();
    const FormRef = useRef()
   const OrgDataEditColumnMap = new Map([
  [
    "OrganizationName",
    <TextBoxWithLogo
      Logo={HiMiniMegaphone}
      IsMandatory={false}
      FloatingText="Organization Name"
      DataProp={"hello"}
      Type="STRING"
      ColorPallete={["#145beb", "#148aebff"]}
    />
  ]
]);

    const DialActions = [{Logo:HiMiniMegaphone , Callback:() => {SetShowInviteDiv(true)} , Tooltip:"Invite"} , {Logo:CiShare2 , Callback:() => {console.log("Summa")} , Tooltip:"Share"}]
    //Effects
    useEffect(() => {
        const OrgDetailsTable = StateToTable(useOrg.getState().OrganizationData , {} , ["RunDate" , "OrganizationName","CurrentDaySales","ClosingTime","Weekends"])
        SetOrganizationDataState(OrgDetailsTable)
        
        const PNL = StateToTable(useOrg.getState().OrganizationData , {} , ["TotalRevenue" , "TotalExpense"])
        SetPNLData(PNL)
    } , [])
    //Events
    useEffect(() => {
        const HandleClick = (Event) => {
            if(FormRef.current && !FormRef.current.contains(Event.target)){
                FormRef.current.value = ""
                SetShowInviteDiv(false);
            }
        }
        document.addEventListener("mousedown" , HandleClick);
        return () => document.removeEventListener("mousedown", HandleClick);
    } , [])
  return (
    <div className = {Styles['Main-Div']}>
            <div ref={FormRef} className={Styles['Form-Div']}  style={{transform: ShowInviteDiv ? "translate(25%, 10%)" : "translate(25%, -110%)"}}>
                <InviteToOrgPage />
            </div>
         <div className = {Styles['Top-Div']}>
                   {/* About this page details */}
                   <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                       <BsBuildingFill />
                       <label className={Styles['Styled-Label']}>Organization</label>
                   </div>
          </div>
          <div className = {Styles['PageDesc-Div']} style={{marginBottom:'2rem'}}>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Find your organization data. Alter organization functionalities by hovering the:</label>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#027aa6ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                        +  
                </label>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>
                    dial button.
                </label>              
            </div>
            <div className = {Styles['Mid-Div']}>
                <div style={{display:'flex' , width:'100%'}}>
                    {OrganizationDataState && OrganizationDataState?.Columns && (
                    <Table 
                        TableName={"Organization-Info"}
                        TableArg={OrganizationDataState}
                        Dimensions={['100%' , '']}
                        EditColumnsMap={OrgDataEditColumnMap}
                        DisplayOptions = {true}
                    />

                )}
                </div>
                <div style={{marginTop:'1rem'}}>
                    {PNLData && PNLData?.Columns && (
                        <Table 
                            TableName={"Profit to Loss"}
                            TableArg={PNLData}
                            Dimensions={['25%' , '']}
                            DisplayOptions = {false}
                        />
                    )}
                </div>
            </div>
            <div>

            </div>
            <div style={{position:'absolute' , right:0 , bottom:0}}>
                    <DialButton 
                        ActionArray={DialActions}
                        DialButtonColor={'#004a71ff'}      
                    />
            </div>
            
    </div>
  )
}

export default OrganizationPage