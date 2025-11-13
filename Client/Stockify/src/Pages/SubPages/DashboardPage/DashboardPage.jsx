import React, { useEffect, useState } from 'react'
import Styles from './DashboardPage.module.css'

//Components
import LabelWithLogo from '../../Components/LabelWithLogo/LabelWithLogo.jsx'
import Table from '../../Components/Table/Table.jsx';
import * as d3 from 'd3'

//Logos
import { CgProfile } from 'react-icons/cg'
import { MdWindow } from "react-icons/md";
import { BsBoxes } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { BsBuildingFill } from 'react-icons/bs';
import { FaChartPie } from "react-icons/fa";
import { FcComboChart } from "react-icons/fc";

import UseProduct from '../../../Stores/ProductStore.js';
import useOrg from '../../../Stores/OrgStore.js';
import LineGraph from '../../Components/Graphs/LineGraph/LineGraph.jsx';
import { StateToChart, StateToMultiLineChart } from '../../../Utils/QueryToObject.js';
import { GraphTypes } from '../../../Declarations/ClientPublicEnums.js';
import BarChart from '../../Components/Graphs/BarChart/BarChart.jsx';


function DashboardPage() {
  //Destructure Store hooks
  const {GetProducts , OrganizationAnalytics , ProductAnalytics , Products , VendorAnalytics} = UseProduct();
  const {OrganizationData} = useOrg();

  //States
  const [OrgChartData , SetOrgChartData] = useState();
  const [ProductChartData , SetProductChartData] = useState();
  const [VendorChartData , SetVendorChartData] = useState();

  useEffect (() => {
    function BuildChartData(){ 
      const OrgChart = StateToChart(OrganizationAnalytics , ['RunDate' , 'Sales'] , GraphTypes.SINGLELINE_CHART );
      SetOrgChartData(OrgChart);

      const ProductChart = StateToMultiLineChart(ProductAnalytics , [] , Products[0].map(Product => Product.ProductName) , 'SaleQuantity' , 'RunDate' , 'ProductName');
      SetProductChartData(ProductChart);

      const VendorChart = StateToChart(VendorAnalytics , ['VendorName' , 'DeliveredOrders'] , GraphTypes.BAR_CHART);
      SetVendorChartData(VendorChart)
    }
    BuildChartData()
    
  } , [OrganizationAnalytics , ProductAnalytics])
  return (
    <div className = {Styles['Main-Div']}>
      <div className = {Styles['Top-Div']}>
        <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
            <FaChartPie  size={'3rem'} color='rgba(146, 73, 0, 0.73)'/>
            <label className={Styles['Styled-Label']}>{`${OrganizationData && OrganizationData[0][0].OrganizationName} Dashboard` || NA}</label>
        </div>
      </div>
        <div className = {Styles['OrgData-Div']} >
            <LabelWithLogo 
                Logo={CgProfile}
                Header={"Users"}
                Value={10}
                BGColor={"#c58702ff"}
            />
            <LabelWithLogo 
                Logo={MdWindow}
                Header={"Categories"}
                Value={8}
                BGColor={"#1e7a00ff"}
            />
            <LabelWithLogo 
                Logo={BsBoxes}
                Header={"Products"}
                Value={54}
                BGColor={"#2b7877ff"}
            />
            <LabelWithLogo 
                Logo={FaHandsHelping}
                Header={"Investment"}
                Value={'$4500'}
                BGColor={"#a14134ff"}
            />
            <LabelWithLogo 
                Logo={BsCurrencyDollar}
                Header={"Turnover"}
                Value={'$8500'}
                BGColor={"#2f2d2cff"}
            />
        </div>
        <div className = {Styles['Top-Div2']}>
        <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
            <FcComboChart  size={'3rem'} />
            <label className={Styles['Styled-Label']}>Analytics</label>
        </div>
      </div>
      <div style={{display:'flex' , justifyContent:'center' , alignContent:'center'}}>
        {console.log("The Product performnace",ProductChartData , "Analytics:" , ProductAnalytics)}
        <LineGraph 
          Data={OrgChartData}
          Height={300}
          Width={800} 
          Smooth={d3.curveBasis}
          XLabel='Business Date'
          YLabel='Sales'
          ChartName='Organiation Sales Performance'
        />
      </div>
      <div style={{display:'flex' , marginTop:'1rem' , gap:'0.5rem'}}>
        <LineGraph 
        ChartName='Most Selling Products'
          Data={ProductChartData}
          Height={300}
          Width={500}
          XLabel='Business Date'
          YLabel='Product Sell Quantity'
          LegendArray={Products[0].map(Product => Product.ProductName)}
          
        />
        <BarChart 
          Data={VendorChartData}
          Height={300}
          Width={500}
        />

      </div>


    </div>
  )
}

export default DashboardPage