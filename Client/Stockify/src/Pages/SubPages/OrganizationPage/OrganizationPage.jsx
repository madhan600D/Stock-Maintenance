import React, { useEffect, useRef, useState } from 'react'
import Styles from './OrganizationPage.module.css'

//Icons
import { BsBuildingFill } from "react-icons/bs";
import { StateToChart, StateToTable } from '../../../Utils/QueryToObject';
import { HiMiniMegaphone } from "react-icons/hi2";
import { CiShare2 } from "react-icons/ci";
import { FaShop } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";


//Stores
import useOrg from '../../../Stores/OrgStore';

//Components
import Table from '../../Components/Table/Table.jsx'
import DialButton from '../../Components/DialButton/DialButton.jsx';
import InviteToOrgPage from '../InviteToOrgPage/InviteToOrgPage.jsx';
import TextBoxWithLogo from '../../Components/TextBoxWithLogo/TextBoxWithLogo.jsx';
import Button from '@mui/material/Button';
import ActionButton from '../../Components/ActionButton/ActionButton.jsx';
import TypingSuspense from '../../Components/Suspense Components/TypingSuspense/TypingSuspense.jsx';
import ShowToast from '../../Components/Toast/Toast.js';
import { ToastContainer } from 'react-toastify';
import BarChart from '../../Components/Graphs/BarChart/BarChart.jsx';
import { GraphTypes } from '../../../Declarations/ClientPublicEnums.js';
import UseProduct from '../../../Stores/ProductStore.js';
function OrganizationPage() {
    //States
    const [ShowInviteDiv , SetShowInviteDiv] = useState(false);
    const [ShowCloseDayPage , SetShowCloseDayPage] = useState(false);
    const [OrganizationDataState , SetOrganizationDataState] = useState();
    const [PNLData , SetPNLData] = useState();
    const [OrgActivityData , SetOrgActivityData] = useState();

    const {OrganizationData , IsClosingDay , CloseDay} = useOrg();
    const {CheckOuts , OrderHistory , CurrentOrders} = UseProduct();
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

    const DialActions = [{Logo:HiMiniMegaphone , Callback:() => {SetShowInviteDiv(true)} , Tooltip:"Invite"} , {Logo:CiShare2 , Callback:() => {console.log("Summa")} , Tooltip:"Share"} , {Logo:SlCalender , Callback:() => {SetShowCloseDayPage(true)} ,Tooltip:"CloseDay"}]
    //Effects
    useEffect(() => {
        const OrgDetailsTable = StateToTable(OrganizationData , {} , ["RunDate" , "OrganizationName","Weekends"])
        SetOrganizationDataState(OrgDetailsTable)
        
        // const PNL = StateToTable(OrganizationData , {} , ["TotalRevenue" , "TotalExpense"])
        // SetPNLData(PNL)

        const PNLGraph = StateToChart(OrganizationData && OrganizationData[0] , ['TotalRevenue' , 'TotalExpense'] , GraphTypes.BAR_CHART_OBJECT)

        SetPNLData(PNLGraph);

        const OrganizationActivity = {TotalCheckouts:CheckOuts[0]?.length, TotalOrders:CurrentOrders[0]?.length + OrderHistory[0]?.length , DeliveredOrders:OrderHistory[0]?.length , StandingOrders:CurrentOrders[0]?.length}
        const OrgActivity = StateToChart([OrganizationActivity] , ['TotalCheckouts','TotalOrders' , 'DeliveredOrders' , 'StandingOrders'] , GraphTypes.BAR_CHART_OBJECT)
        SetOrgActivityData(OrgActivity);

    } , [OrganizationData])
    //Events
    useEffect(() => {
        const HandleClick = (Event) => {
            if(FormRef.current && !FormRef.current.contains(Event.target)){
                FormRef.current.value = ""
            }
        }
        document.addEventListener("mousedown" , HandleClick);
        return () => document.removeEventListener("mousedown", HandleClick);
    } , [])
    //Functions
    async function HandleCloseDay(){
        try {
            const IsDayClosed = await CloseDay()
            ShowToast(IsDayClosed.success , IsDayClosed.message);
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className = {Styles['Main-Div']}>
            <div ref={FormRef} className={Styles['Form-Div']}  style={{transform: ShowInviteDiv ? "translate(25%, 10%)" : "translate(25%, -110%)"}}>
                <div ref={FormRef}>
                    <InviteToOrgPage />
                </div>
                
            </div>
            <div ref={FormRef} className={Styles['Form-Div']}  style={{transform: ShowCloseDayPage ? "translate(60%, 10%)" : "translate(60%, -110%)"}}>
                <div className = {Styles['CloseDay-Div']}>
                    <div className = {Styles['Top-Div']}>
                            {/* About this page details */}
                            <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                                <FaShop />
                                <label className={Styles['Styled-Label']}>Close Day</label>
                            </div>
                    </div>
                    <div className = {Styles['PageDesc-Div']} style={{marginBottom:'2rem'}}>
                                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' }}>Move you'r organization to the next day by clicking:</label>
                                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e4870ff' , padding:'0.8rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                                        <SlCalender /> Close Day
                                </label>
                                <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>
                                    Button.
                                </label>
                    </div>
                    <div style={{display:'flex' , justifyContent:'center' , width:'100%'}}>
                        <button disabled = {IsClosingDay} style={{width:'15rem' , height:'3rem'}} onClick={() => HandleCloseDay()} className= {Styles['Action-Button']}>{IsClosingDay == true ? <TypingSuspense /> :<SlCalender size={'1rem'} color='#adbdd5ff'/>}{!IsClosingDay ? 'Close Day' : ''}</button>
                        
                    </div>
                    
                </div>
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
                <div style={{marginTop:'1rem'}} className = {Styles['Graph-Div']}>
                    <BarChart 
                        Data={PNLData}
                        ChartName='PNL Ratio'
                        Height={200}
                        Width={300}
                        XLabel='Expense/Revenue'
                        YLabel='Value'
                    />

                    <BarChart 
                        Data={OrgActivityData}
                        ChartName='Organization Activity'
                        Height={200}
                        Width={300}
                        XLabel='Activity'
                        YLabel='Value'
                        CustomColors
                    />
                </div>
            </div>
            <div className = {Styles['Dial-Div']}>
                <DialButton 
                    className = {Styles['Dial-Button']}
                    ActionArray={DialActions}
                    DialButtonColor={'#004a71ff'}      
                />
            </div>
            <ToastContainer />
    </div>
  )
}

export default OrganizationPage