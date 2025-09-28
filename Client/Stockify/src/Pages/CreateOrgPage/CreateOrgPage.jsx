import React, { useEffect, useReducer, useRef, useState } from 'react'
import Styles from './CreateOrgPage.module.css'
import TextBoxWithLogo from '../Components/TextBoxWithLogo/TextBoxWithLogo.jsx'
//Components
import FormComponent from '../Components/FormComponent/FormComponent.jsx' 
import { ToastContainer } from 'react-toastify';
import FallBackSpinner from '../Components/Suspense Components/FallBackSpinner/FallBackSpinner.jsx';
import ShowToast from '../Components/Toast/Toast.js';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Alert from '@mui/material/Alert';
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
import { useNavigate } from 'react-router-dom';
import ItemAdder from '../Components/ItemAdder/ItemAdder.jsx';
import { create } from 'zustand';
import dayjs from 'dayjs';

function CreateOrgPage() {
  //Hooks
  const OrganizationNameRef = useRef();
  const BusinessTypeRef = useRef();
  const StreetRef = useRef();
  const CityRef = useRef();
  const CountryRef = useRef();
  const PinCodeRef = useRef();

  //Destructure
  const {CreateOrg , OrganizationData , IsNewOrgLoading} = useOrg();
  const navigate = useNavigate();

  //Reducer Logic
  
  //States

  const InitialState = {OrganizationName:"" , TypeOfBusiness:"" , Address:{Street:"" , City:"" , Country:"" , Pincode:""} , ClosingTime:null , Weekends:[]}

  const OrgActions = Object.freeze({
    SET_ORGANIZATION_NAME: "SET_ORGANIZATION_NAME",
    SET_TYPE_OF_BUSINESS: "SET_TYPE_OF_BUSINESS",
    SET_ADDRESS_STREET: "SET_ADDRESS_STREET",
    SET_ADDRESS_CITY: "SET_ADDRESS_CITY",
    SET_ADDRESS_COUNTRY: "SET_ADDRESS_COUNTRY",
    SET_ADDRESS_PINCODE: "SET_ADDRESS_PINCODE",
    SET_CLOSING_TIME: "SET_CLOSING_TIME",
    SET_WEEKENDS: "SET_WEEKENDS"
  });

const OrgReducer = (State , Action) => {
    switch (Action.type){
      case OrgActions.SET_ORGANIZATION_NAME:
        return {
          ...State , OrganizationName:Action.payload
        }
      case OrgActions.SET_TYPE_OF_BUSINESS:
        return {
          ...State , TypeOfBusiness:Action.payload
        }
      case OrgActions.SET_ADDRESS_STREET:
        return {
          ...State , Address:{...State.Address , Street:Action.payload}
        }
      case OrgActions.SET_ADDRESS_CITY:
        return {
          ...State , Address:{...State.Address , City:Action.payload}
        }
      case OrgActions.SET_ADDRESS_COUNTRY:
        
        return {
          ...State , Address:{...State.Address , Country:Action.payload}
        }
      case OrgActions.SET_ADDRESS_PINCODE:
        return {
          ...State , Address:{...State.Address, Pincode:Action.payload}
        }
      case OrgActions.SET_WEEKENDS:
        return {
          ...State,
          Weekends: Action.payload  
        }
      case OrgActions.SET_CLOSING_TIME:
        return {
          ...State , ClosingTime:Action.payload
        }
      default:
        return State;
      
    }
  }

  const [OrgState , Dispatch] = useReducer(OrgReducer , InitialState);
  
const DescBox = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          color: "white",
          height:"150px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height:"150px",
          color:'#c0c0c0ff',
          display:'flex',
          alignItems:'flex-start',
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5A7DC4",
          },
          "& input": {
            color: "#5A7DC4", // text color
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white",
          "&.Mui-focused": {
            color: "#5A7DC4",
          },
        },
      },
    },
  },
});

const CountrySelectTheme = createTheme({
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

const WeekendButtonTheme = createTheme({
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderColor: "white",       // Not Toggled Border
          color: "#5A7DC4",              // Not Toggled Text
          fontWeight: "bold",       // Default
          "&.Mui-selected": {
            borderColor: "white",  // No Border when toggled
            backgroundColor: "#5A7DC4",    // Toggled Background
            color: "white",             // Toggled Text
            fontWeight: "bold",         // Bold when toggled
            "&:hover": {
              borderColor: "white",
            },
          },
        },
      },
    },
  },
});

const TimePickerTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor:'grey',
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
            
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", // hover border
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2", // blue border on focus
          },
        },
        input: {
          color: "white", // default text color (empty state)
          "&.Mui-focused": {
            color: "#1976d2", // focused text color
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white", // default label
          "&.Mui-focused": {
            color: "#1976d2", // focused label
          },
        },
      },
    },
  },
});

const CreateOrgStructure = {
  "Basic Details": [
    {
      "Details": {
        ArrayOfElements: [
          <TextBoxWithLogo
            Logo={FaBuilding}
            IsMandatory={false}
            FloatingText="Organization Name"
            DataProp={OrgState.OrganizationName}
            Type="STRING"
            Reference={OrganizationNameRef}
            ColorPallete={["#145beb", "#148aebff"]}
            TBCallBack={(Data) => {
              Dispatch({ type: OrgActions.SET_ORGANIZATION_NAME , payload: Data })
            }
              
            }
          />,
          <TextBoxWithLogo
            Logo={MdBusinessCenter}
            IsMandatory={false}
            DataProp={OrgState.TypeOfBusiness}
            FloatingText="Business Type"
            Type="STRING"
            Reference={BusinessTypeRef}
            ColorPallete={["#eb7514ff", "#eb6614ff"]}
            TBCallBack={(Data) => {
              Dispatch({ type: OrgActions.SET_TYPE_OF_BUSINESS , payload: Data })
            }
            }
          />,
        ],
        GridSpan: 2,
      },
    },
    {
      "": {
        ArrayOfElements: [
          <div style={{ width: "100%" }}>
            <ThemeProvider theme={DescBox}>
              <TextField
                id="outlined-basic"
                label="About Organization"
                multiline
                variant="outlined"
              />
            </ThemeProvider>
          </div>,
        ],
        GridSpan: 1,
      },
    },
  ],

  "Address": [
    {
      "": {
        ArrayOfElements: [
          <TextBoxWithLogo
            Logo={FaBuilding}
            IsMandatory={false}
            FloatingText="Street"
            DataProp={OrgState.Address.Street}
            Type="STRING"
            Reference={CountryRef}
            ColorPallete={["#145beb", "#148aebff"]}
            TBCallBack={(Data) => {
              Dispatch({ type: OrgActions.SET_ADDRESS_STREET , payload: Data })
            }
            }
          />,
          <TextBoxWithLogo
            Logo={MdBusinessCenter}
            IsMandatory={false}
            FloatingText="City"
            Type="STRING"
            DataProp={OrgState.Address.City}
            Reference={CityRef}
            ColorPallete={["#eb7514ff", "#eb6614ff"]}
            TBCallBack={(Data) => {
              Dispatch({ type: OrgActions.SET_ADDRESS_CITY , payload: Data })
            }
            }
          />,
          <ThemeProvider theme={CountrySelectTheme}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                id="demo-simple-select"
                label="Country"
                value={OrgState?.Address.Country || ""}
                onChange={(Data) => {Dispatch({type:OrgActions.SET_ADDRESS_COUNTRY , payload:Data.target.value})}}
              >
                <MenuItem value={"India"}>India</MenuItem>
                <MenuItem value={"Sweden"}>Sweden</MenuItem>
                <MenuItem value={"Japan"}>Japan</MenuItem>
                <MenuItem value={"China"}>China</MenuItem>
                <MenuItem value={"France"}>France</MenuItem>
                <MenuItem value={"Italy"}>Italy</MenuItem>
              </Select>
            </FormControl>
          </ThemeProvider>,
          <TextBoxWithLogo
            Logo={MdBusinessCenter}
            IsMandatory={false}
            FloatingText="PinCode"
            DataProp={OrgState.Address.Pincode}
            Type="INTEGER"
            Reference={PinCodeRef}
            ColorPallete={["#eb7514ff", "#eb6614ff"]}
            TBCallBack={(Data) => {
              Dispatch({ type: OrgActions.SET_ADDRESS_PINCODE , payload: Data })
            }
            }
          />,
        ],
        GridSpan: 3,
      },
    },
  ],

  "Operational Details": [
    {
      "": {
        ArrayOfElements: [
          <div className= {Styles['Weekend-Div']}>
              <label>Closing Time:</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <ThemeProvider theme={TimePickerTheme}>
                      <TimePicker
                        label="Closing Time"
                        value={OrgState.ClosingTime || null}
                        onChange={(newValue) => {
                          Dispatch({ type: OrgActions.SET_CLOSING_TIME, payload:newValue  });
                        }}
                      />
                  </ThemeProvider>
            </LocalizationProvider>
          </div>
             , 
            <div className= {Styles['Weekend-Div']}>
                <label>Weekends:</label>
                <ThemeProvider theme={WeekendButtonTheme}>
                    <ToggleButtonGroup
                      value={OrgState.Weekends}   // controlled state
                      onChange={(event, Data) => {
                        if (Data.length > 2) return; // max 2 selected
                        Dispatch({ type: OrgActions.SET_WEEKENDS, payload: Data });
                      }}
                      aria-label="weekends"
                    >
                      <ToggleButton value="MON">M</ToggleButton>
                      <ToggleButton value="TUE">T</ToggleButton>
                      <ToggleButton value="WED">W</ToggleButton>
                      <ToggleButton value="THU">Th</ToggleButton>
                      <ToggleButton value="FRI">F</ToggleButton>
                      <ToggleButton value="SAT">Sa</ToggleButton>
                      <ToggleButton value="SUN">Su</ToggleButton>
                    </ToggleButtonGroup>

                </ThemeProvider>
                
            </div>
            
  
        ],
        GridSpan: 2,
      },
    
    },
    
  ] , "Summary":[
      {
      "":{ArrayOfElements:[
        <div className = {Styles['Summary-Div']}> 
          <label>Here is your final settings of your new organization</label>
          <h3 style={{color:'#148aebff'}}>Organization Info:</h3>
            <div className={Styles['Summary-Div']}>
              <label style={{color:'bisque'}}>Organization Name: </label>
              <label>{ OrgState.OrganizationName}</label>
            </div>
            <div className={Styles['Summary-Div']}>
              <label style={{color:'bisque'}}>Business Type Name: </label>
              <label>{ OrgState.TypeOfBusiness}</label>
            </div>
            <br />
            <label style={{color:'#148aebff'}}>Location: </label>
            <label>{ `${OrgState.Address.Street},${OrgState.Address.City} ,${OrgState.Address.Country}${OrgState.Address.Street},${OrgState.Address.Pincode} ` }</label>
            <br />
            <div className={Styles['Summary-Div']}>
              <label style={{color:'bisque'}}>Closing Time:  </label>
              <label>{OrgState.ClosingTime ? `${OrgState.ClosingTime.format("HH:mm:ss")} (Org will be shifted to next date at this time)` : ""}</label>
            </div>
            <br />
            <div className={Styles['Summary-Div']}>
              <label style={{color:'bisque'}}>Weekends:  </label>
              <label>{OrgState.Weekends ? OrgState.Weekends.toString() : ''}</label>
              <label style={{color:'#148aebff'}}> (System Will consider these days as holidays)</label>
            </div>
            <br />
            <br />
            <label  style={{color:'#148aebff' , justifySelf:'center'}}>Confirm to create your new organization</label>            
        </div> 
          
      ] , GridSpan:1}
    }],
};

  const HandleSubmitButtonClick = async () => {
    const NewOrganizationCreated = await CreateOrg(OrgState) ; 
    if(NewOrganizationCreated.success){
      
      ShowToast(true , `Organization created ${NewOrganizationCreated.message}. Redirecting....`)
      //Route to Invite Page
      setTimeout(()=> {navigate('/home')} , 3000)
      
      
    }
    else{
      ShowToast(false , "Organization creation failed")
    }
  }
  return (
    <>
      <div className={Styles["Main-Div"]}>
        <FormComponent 
          Structure={CreateOrgStructure}
          ReducerCall={OrgReducer}
          ReducerState={OrgState}
          LoadingState={IsNewOrgLoading}
          ActionTypes={OrgActions}
          SubmitCallback={HandleSubmitButtonClick}
        />
    </div>
    <ToastContainer />
      
    </>
    
  );
}
export default CreateOrgPage