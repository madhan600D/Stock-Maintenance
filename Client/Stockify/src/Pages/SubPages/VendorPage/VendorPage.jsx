import React, { useRef, useState , useReducer , useEffect} from 'react'
import Styles from './VendorPage.module.css'
import LabelWithLogo from '../../Components/LabelWithLogo/LabelWithLogo'

//Logos
import { MdOutlineEventAvailable } from "react-icons/md";
import { FaHourglassEnd } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { FaTruck } from "react-icons/fa";
import { CiViewTable } from "react-icons/ci";

import { VscGraphLine } from "react-icons/vsc";


//Components
import SimpleButton from '../../Components/SimpleButton/SimpleButton';
import FormComponent from '../../Components/FormComponent/FormComponent';
import { ThemeProvider } from '@emotion/react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { createTheme } from '@mui/material/styles';
import TextBoxWithLogo from '../../Components/TextBoxWithLogo/TextBoxWithLogo.jsx';
import MenuItem from '@mui/material/MenuItem';
import { GiSatelliteCommunication } from "react-icons/gi";
import Table from '../../Components/Table/Table.jsx';
import BarChart from '../../Components/Graphs/BarChart/BarChart.jsx'

//Stores
import UseProduct from '../../../Stores/ProductStore.js';
import { StateToChart, StateToTable } from '../../../Utils/QueryToObject.js';
import ShowToast from '../../Components/Toast/Toast.js';
import { ToastContainer } from 'react-toastify';
import PageSelector from '../../Components/PageSelector/PageSelector.jsx';
import { GraphTypes } from '../../../Declarations/ClientPublicEnums.js';

function VendorPage() {
    //Hooks
    const [ShowDiv , SetShowDiv] = useState(false);
    const [TableData , SetTableData] = useState();
    const [AverageLeadTimeGraphData , SetAverageLeadTimeGraphData] = useState();

    //Login --> Graph , SignUp --> Table
    const [CurrentView , SetCurrentView] = useState("Login");

    const VendorNameRef = useRef();
    const VendorLocationRef = useRef();
    const VendorAPIRef = useRef();

    //Destructure
    const {GetVendors , Vendors , AddVendor , AverageLeadTime , CurrentOrders} = UseProduct();
    const InitialState = {VendorName:"" , VendorLocation:"" , VendorAPIType:"" , VendorAPI:""}


    //Effects
    useEffect(() => {
        async function CallTheGetVendors() {
            const IsSuccess =  await GetVendors();
            if(IsSuccess){
                const table =  StateToTable(Vendors, {} , ['VendorName' , 'VendorLocation' , 'VendorAPI']); 
                SetTableData(table);
            }
        }   
        CallTheGetVendors()
        console.log('This is CurentOrders' , CurrentOrders)
        const AverageLeadTimeGraph = StateToChart(AverageLeadTime , ['VendorName' , 'AverageLeadTime' ] , GraphTypes.BAR_CHART);
        SetAverageLeadTimeGraphData(AverageLeadTimeGraph);

    } , [])
    //Themes
    const APISelect = createTheme({
      components: {
        MuiSelect: {
          styleOverrides: {
            root: {
              color: "white", // text color inside select
              height:'40px',
            },
            icon: {
              color: "#5A7DC4", // dropdown arrow color
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ffffffff", // default border
    
    
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ffffffff", // hover border
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#5A7DC4", // focused border
              },
            },
            input: {
              color: "white", // input text color (covers when select renders)
                          display:'flex',
              alignItems:'center',
            },
          },
        },
        MuiInputLabel: {
        styleOverrides: {
          root: {
            textAlign:'center',
            transform:'translate(20%,35%) scale(1)',
            color: "white",
            "&.Mui-focused": {
              transform:'translate(25%,-40%) scale(0.8)',
              color: "#5A7DC4", // label turns blue when focused
            },
            "&.MuiFormLabel-root.Mui-disabled": {
              color: "gray", // optional: label color when disabled
            },
          },
        }
    }}});

    const VendorActions = Object.freeze({
        SET_VENDOR_NAME: "SET_VENDOR_NAME",
        SET_VENDOR_LOCATION: "SET_VENDOR_LOCATION",
        SET_VENDOR_API_TYPE: "SET_VENDOR_API_TYPE",
        SET_VENDOR_API:"SET_VENDOR_API"
    });

    const VendorReducer = (State , Action) => {
        switch (Action.type){
        case VendorActions.SET_VENDOR_NAME:
            return {
            ...State , VendorName:Action.payload
            }
        case VendorActions.SET_VENDOR_LOCATION:
            return {
            ...State , VendorLocation:Action.payload
            }
        case VendorActions.SET_VENDOR_API_TYPE:
            return {
            ...State , VendorAPIType:Action.payload
            }
        case VendorActions.SET_VENDOR_API:
            return {
            ...State , VendorAPI:Action.payload
            }
        default:
            return State;
        
        }
    }
  
    const [VendorState , Dispatch] = useReducer(VendorReducer , InitialState);

    const CreateVendorLayout = {
      "Add Vendor": [
        {
          "Details": {
            ArrayOfElements: [
              <TextBoxWithLogo
                Logo={MdBusinessCenter}
                IsMandatory={false}
                FloatingText="Vendor Name"
                DataProp={VendorState.VendorName}
                Type="STRING"
                Reference={VendorNameRef}
                ColorPallete={["#2a5cbaff", "#011b23ff"]}
                TBCallBack={(Data) => {Dispatch({ type: VendorActions.SET_VENDOR_NAME , payload: Data })}}
              />,
                 <TextBoxWithLogo
                    Logo={IoLocationSharp}
                    IsMandatory={false}
                    FloatingText="Location"
                    DataProp={VendorState.VendorLocation}
                    Type="STRING"
                    Reference={VendorLocationRef}
                    ColorPallete={["#003d09ff", "#011b23ff"]}
                    TBCallBack={(Data) => {Dispatch({ type: VendorActions.SET_VENDOR_LOCATION , payload: Data })}}
              />,
            ],
            GridSpan: 1,
          } , 
          "API Data":{
            ArrayOfElements:[
                <ThemeProvider theme={APISelect}>
                    <FormControl fullWidth variant="outlined">
                    <InputLabel id="country-label">API Type</InputLabel>
                        <Select
                            labelId="API-label"
                            id="demo-simple-select"
                            label="Api Type"
                            value={VendorState?.VendorAPIType || ""}
                            onChange={(Data) => {Dispatch({type:VendorActions.SET_VENDOR_API_TYPE , payload:Data.target.value})}}
                        >
                            <MenuItem value={"API"}>API</MenuItem>
                            <MenuItem value={"EMAIL"}>EMAIL</MenuItem>
                        </Select>
                    </FormControl>
                </ThemeProvider>,
                <TextBoxWithLogo
                    Logo={GiSatelliteCommunication}
                    IsMandatory={false}
                    FloatingText="API"
                    DataProp={VendorState.VendorAPI}
                    Type="STRING"
                    Reference={VendorAPIRef}
                    ColorPallete={["#cd5104ff", "#011b23ff"]}
                    TBCallBack={(Data) => {Dispatch({ type: VendorActions.SET_VENDOR_API , payload: Data })}}
              />
            ]
          }
        }, 
      ],
    };
    
    //Functions
    const HandleAddVendor = async () => {
        try {
            const res = await AddVendor(VendorState);
            ShowToast(res.success , res.message)
        } catch (error) {
            ShowToast(false , "Failed to add vendor")
        }
    }
  return (
    <div className = {Styles['Main-Div']}>
      <div className = {Styles['Top-Div']}>
            {/* About this page details */}
            <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                <FaTruck />
                <label className = {Styles['Vendor-Label']}>Vendors</label>
            </div>
            <div className = {Styles['Simple-Button']}>
              <SimpleButton 
                ButtonText={"ADD VENDOR"}
                BGColor={"#0f9ec6ff"}
                Dimensions={[10, 3]}
                Callback={() => {SetShowDiv(Prev => !Prev)}}
            />
            </div>          
        </div>
        <div className= {Styles['Top2-Div']}>
            <LabelWithLogo 
                Logo={MdOutlineEventAvailable}
                Header={"Available Vendors"}
                Value={Vendors[0]?.length}
                BGColor={'#1d2b2fff'}
                Dimension={['30rem' , '7.5rem']}
            />
            <LabelWithLogo 
                Logo={FaHourglassEnd}
                Header={"Vendors With Pending Orders"}
                Value={CurrentOrders[0]?.length}
                BGColor={'#2d1911ff'}
                Dimension={['30rem' , '7.5rem']}
            />
        </div>

        <div className = {Styles['Side-Div']} style={{transform: ShowDiv ? "translateX(20%)" : "translateX(120%)"}}>
            <FormComponent 
                Structure={CreateVendorLayout}
                ReducerState={VendorState}
                LoadingState={false}
                SubmitCallback={() => {HandleAddVendor()}}
            />
        </div>
        
        <div className = {Styles['Mid-Div']}>
          <div className = {Styles['PageSelect-Div']}>
            <PageSelector
                PageHeader={[<div className = {Styles['PageTab-Div']}><VscGraphLine size={28} color="#4A90E2" /><label style={{fontSize:'0.8rem' ,fontFamily:'poppins'}}>Graphs</label></div>  , <div className = {Styles['PageTab-Div']}><CiViewTable  size={28} color="#4A90E2" /><label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Table</label></div>]}
                CurrentPage={CurrentView}
                SetCurrentPage={SetCurrentView}
                Dimension={['40rem' , 'auto']}
            />
        </div>

            { CurrentView == "SignUp" && TableData && (
                <Table 
                TableName={"VENDORS"}
                TableArg={TableData}
                ColumnPalette={["white" , "grey"]}
                RowPalette={["grey" , "white" , "black"]}
                Dimensions={['100%' , 'auto']}
                />)} 
            {
              CurrentView == "Login" && (
                <BarChart 
                  ChartName='Average Lead Time'
                  Data={AverageLeadTimeGraphData}
                  Height = {300}
                  Width={600}
                  XLabel='VendorName'
                  YLabel='Average Delivery Time(Days)'
                />
              )
            }

        </div>
        <ToastContainer />
    </div>
  )
}

export default VendorPage