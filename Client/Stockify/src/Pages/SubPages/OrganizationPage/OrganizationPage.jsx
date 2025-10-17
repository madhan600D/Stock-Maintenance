import React, { useEffect, useState } from 'react'
import Styles from './OrganizationPage.module.css'

//Icons
import { BsBuildingFill } from "react-icons/bs";
import { StateToTable } from '../../../Utils/QueryToObject';

//Stores
import useOrg from '../../../Stores/OrgStore';

//Components
import Table from '../../Components/Table/Table.jsx'
import DialButton from '../../Components/DialButton/DialButton.jsx';
function OrganizationPage() {

    const [OrganizationDataState , SetOrganizationDataState] = useState();
    const [PNLData , SetPNLData] = useState();
    const {OrganizationData} = useOrg();
    //Effects
    useEffect(() => {
        const OrgDetailsTable = StateToTable(useOrg.getState().OrganizationData , {} , ["RunDate" , "OrganizationName","CurrentDaySales","ClosingTime","Weekends"])
        SetOrganizationDataState(OrgDetailsTable)
        
        const PNL = StateToTable(useOrg.getState().OrganizationData , {} , ["TotalRevenue" , "TotalExpense"])
        SetPNLData(PNL)
    } , [])
  return (
    <div className = {Styles['Main-Div']}>
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
                        DisplayOptions = {false}
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
                <DialButton 
                    
                />
            </div>
    </div>
  )
}

export default OrganizationPage