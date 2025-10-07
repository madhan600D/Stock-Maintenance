import React, { useRef, useState , useReducer} from 'react'
import Styles from './ProductPage.module.css'

//Components
import LabelWithLogo from '../../Components/LabelWithLogo/LabelWithLogo.jsx'
import SimpleButton from '../../Components/SimpleButton/SimpleButton.jsx'
import TextBoxWithLogo from '../../Components/TextBoxWithLogo/TextBoxWithLogo.jsx'
import DialButton from '../../Components/DialButton/DialButton.jsx';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import NumberInput from '../../Components/NumberInput/NumberInput.jsx'
import FormComponent from '../../Components/FormComponent/FormComponent.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//Logos
import { FaBoxOpen } from "react-icons/fa6";
import { BiSolidFileImage } from "react-icons/bi";
import { IoIosClose } from 'react-icons/io'

//Stores
import UseProduct from '../../../Stores/ProductStore.js';
import dayjs from 'dayjs'
import ShowToast from '../../Components/Toast/Toast.js'
import Tooltip from '@mui/material/Tooltip'
import { ToastContainer } from 'react-toastify'

function ProductPage() {
        //States
        const [ShowDiv , SetShowDiv] = useState(false);
        const {Category , Vendors  , Currency,AddProduct}  = UseProduct();
        const ProductNameRef = useRef();
        const ProductImageRef = useRef();
        const InitialState = {ProductName:"" , ProductPrice:0 , Currency:'' ,ActualPrice:0  , CategoryName:'' , ProductImage:"" , VendorName:'' , ExpirationDate:'' , ReorderThreshold:0 , Unit:"" ,Quantity:0}
        //Functions
        const HandleAddProduct = async() => {
          try {
            const IsSuccess = await AddProduct(ProductState);
            ShowToast(IsSuccess.success , IsSuccess.message)
          } catch (error) {
            ShowToast(false , error.message || "Failed to add product")
          }
        }
        const HandleImageUpload = (e) => {
            const File = e.target.files[0];
            const Reader = new FileReader();
            
            Reader.onload = async () => {
              const Base64ofFile = Reader.result;
              
              Dispatch({type:ProductAction.SET_PRODUCT_IMAGE , payload:Base64ofFile})
            };

            Reader.readAsDataURL(File); 
        };
        const ProductAction = Object.freeze({
            SET_PRODUCT_NAME: "SET_PRODUCT_NAME",
            SET_PRODUCT_IMAGE:"SET_PRODUCT_IMAGE",
            SET_PRODUCT_PRICE: "SET_PRODUCT_PRICE",
            SET_ACTUAL_PRICE: "SET_ACTUAL_PRICE",
            SET_CATEGORY:"SET_CATEGORY",
            SET_VENDOR:"SET_VENDOR",
            SET_CURRENCY:"SET_CURRENCY",
            SET_EXPIRATION_DATE:"SET_EXPIRATION_DATE",
            SET_REORDER_LEVEL:"SET_REORDER_LEVEL",
            SET_UNIT:"SET_UNIT",
            SET_QUANTITY:"SET_QUANTITY"
        });
    
        const ProductReducer = (state, action) => {
            switch (action.type) {
                case ProductAction.SET_PRODUCT_NAME:
                return { ...state, ProductName: action.payload };

                case ProductAction.SET_PRODUCT_PRICE:
                return { ...state, ProductPrice: action.payload };

                case ProductAction.SET_PRODUCT_IMAGE:
                return { ...state, ProductImage: action.payload };

                case ProductAction.SET_ACTUAL_PRICE:
                return { ...state, ActualPrice: action.payload };

                case ProductAction.SET_QUANTITY: 
                return { ...state, Quantity: action.payload };

                case ProductAction.SET_CATEGORY:
                return { ...state, CategoryName: action.payload };

                case ProductAction.SET_VENDOR:
                return { ...state, VendorName: action.payload };

                case ProductAction.SET_CURRENCY:
                return { ...state, CurrencyName: action.payload };

                case ProductAction.SET_EXPIRATION_DATE:
                return { ...state, ExpirationDate: action.payload };

                case ProductAction.SET_REORDER_LEVEL:
                return { ...state, ReorderThreshold: action.payload };

                case ProductAction.SET_UNIT:
                return { ...state, Unit: action.payload };

                default:
                return state;
            }
        };
      
        const [ProductState , Dispatch] = useReducer(ProductReducer , InitialState);
            //Themes
            const CategorySelect = createTheme({
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
                      color: "white", 
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
        const CreateProductLayout = {
          "Basic Product Info": [
            {
              "": {
                ArrayOfElements: [
                  <TextBoxWithLogo
                    Logo={FaBoxOpen}
                    IsMandatory={false}
                    FloatingText="ProductName"
                    DataProp={ProductState.ProductName}
                    Type="STRING"
                    Reference={ProductNameRef}
                    ColorPallete={["#2a5cbaff", "#011b23ff"]}
                    TBCallBack={(Data) => {Dispatch({ type: ProductAction.SET_PRODUCT_NAME , payload: Data })}}
                  />,
                    <ThemeProvider theme={CategorySelect}>
                        <FormControl fullWidth variant="outlined">
                        <InputLabel id="Category-label">Category</InputLabel>
                            <Select
                                labelId="Category-label"
                                id="demo-simple-select"
                                label="Category"
                                value={ProductState?.CategoryName || ""}
                                onChange={(Data) => {Dispatch({type:ProductAction.SET_CATEGORY , payload:Data.target.value})}}
                            >   
                                {Category && Category[0].map((Cat) => (
                                    <MenuItem value={Cat.CategoryName}>{Cat.CategoryName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ThemeProvider>,
                    <ThemeProvider theme={CategorySelect}>
                        <FormControl fullWidth variant="outlined">
                        <InputLabel id="Vendor-label">Vendor</InputLabel>
                            <Select
                                labelId="Vendor-label"
                                id="demo-simple-select"
                                label="Vendor"
                                value={ProductState?.VendorName}
                                onChange={(Data) => {Dispatch({type:ProductAction.SET_VENDOR , payload:Data.target.value})}}
                            >   
                                {Vendors && Vendors[0].map((Ven) => (
                                    <MenuItem value={Ven.VendorName}>{Ven.VendorName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ThemeProvider> , 
                    
                    
                ],
                
                GridSpan: 2,
              } , "Image Upload":{
                ArrayOfElements:[<div style={{display:'flex' , flexDirection:'column' , gap:'2rem'}}>
                      <Tooltip title = 'Upload Image'>
                          <BiSolidFileImage type='file' onClick={() => {ProductImageRef.current.click()}} className= {Styles['ImageUpload-Button']}/>
                        
                      </Tooltip>
                      <input type='file' accept='image/*' ref={ProductImageRef} onChange={() => HandleImageUpload(event)} style={{display:'none'}} />
                      {ProductState.ProductImage !== '' ? <div className= {Styles['imagePreview-Div']}>
                        <IoIosClose onClick={() => Dispatch({type:ProductAction.SET_PRODUCT_IMAGE , payload:''})} className= {Styles['imagePreview-Button']} style={{height:'1.5rem' , width:'1.5rem' ,borderRadius:'50%',transform:'translate(2.6rem,-0.2rem)' , backgroundColor:'#a12344'}} />
                        <img src={ProductState.ProductImage} className= {Styles['imagePreview-Image']}/>
                    </div> : ''}
                      

                    </div>] , 
                    gridSpan:1
              }
            }, 
          ], "Pricing & Currency":[{
            "":{
                ArrayOfElements:[
                    <NumberInput 
                      label='Product Price'
                      value={ProductState.ProductPrice}
                      min={1}
                      step={1}
                      onChange={(Value) => {Dispatch({type:ProductAction.SET_PRODUCT_PRICE , payload:Value})}}
                    />,
                    <NumberInput 
                      label='Actual Price'
                      value={ProductState.ActualPrice}
                      min={1}
                      step={1}
                      onChange={(Value) => {Dispatch({type:ProductAction.SET_ACTUAL_PRICE, payload:Value})}}
                    /> , 
                    <ThemeProvider theme={CategorySelect}>
                        <FormControl fullWidth variant="outlined">
                        <InputLabel id="Currency-label">Currency</InputLabel>
                            <Select
                                labelId="Currency-label"
                                id="demo-simple-select"
                                label="Currency"
                                value={ProductState?.CurrencyName || ""}
                                onChange={(Data) => {Dispatch({type:ProductAction.SET_CURRENCY , payload:Data.target.value})}}
                            >   
                                {Currency && Currency[0].map((Cur) => (
                                    <MenuItem value={Cur.CurrencyName}>{Cur.CurrencyName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ThemeProvider>
                ] , 
                GridSpan:2
        }}] , "Stock & Inventory":[{
          "Quantity":{
            ArrayOfElements:[
              <NumberInput 
                      label='Quantity'
                      value={ProductState.Quantity}
                      min={1}
                      step={1}
                      onChange={(Value) => {Dispatch({type:ProductAction.SET_QUANTITY , payload:Value})}}
              /> ,
              <ThemeProvider theme={CategorySelect}>
                        <FormControl fullWidth variant="outlined">
                        <InputLabel id="Unit-label">Unit</InputLabel>
                            <Select
                                labelId="Currency-label"
                                id="demo-simple-select"
                                label="Unit"
                                value={ProductState?.Unit || ""}
                                onChange={(Data) => {Dispatch({type:ProductAction.SET_UNIT , payload:Data.target.value})}}
                            >   
                                
                                <MenuItem value="UNIT">Unit</MenuItem>
                                <MenuItem value="LITRE">Litre</MenuItem>
                                <MenuItem value="KG">KG</MenuItem>
                                
                            </Select>
                        </FormControl>
                    </ThemeProvider>
            ] , 
            GridSpan:2
          } , 
          "ReOrder Level":{
            ArrayOfElements:[
              <NumberInput 
                      label='ReOrder Threshold'
                      value={ProductState.ReorderThreshold}
                      min={1}
                      step={1}
                      onChange={(Value) => {Dispatch({type:ProductAction.SET_REORDER_LEVEL , payload:Value})}}
              />
            ] , 
            GridSpan:1
          } , 
          "Expiriration Details (Leave blank if not applicable)":{
            ArrayOfElements:[
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <ThemeProvider theme={TimePickerTheme}>
                      <DatePicker
                        minDate={dayjs()}
                        label="Expiration Date"
                        value={ProductState.ExpirationDate || null}
                        slotProps={{ textField: { fullWidth: true, size: "small" } }}
                        onChange={(newValue) => {
                          Dispatch({ type: ProductAction.SET_EXPIRATION_DATE, payload:newValue  });
                        }}
                      />
                    </ThemeProvider>
                </LocalizationProvider>
            ]
          }
        }]
        };
  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['Start-Div']}>
            <label className = {Styles['Product-Label']}>Products</label>
                <SimpleButton 
                    ButtonText={"ADD PRODUCT"}
                    BGColor={"#0f9ec6ff"}
                    Dimensions={[10, 3]}
                    Callback={() => {SetShowDiv(Prev => !Prev)}}
                />
        </div>
            <div className= {Styles['Top-Div']}>
                <LabelWithLogo 
                    Logo={FaBoxOpen}
                    Header={"Warning"}
                    Value={30}
                    BGColor={'#282f31ff'}
                    Dimension={[500 , 100]}
                />
                <DialButton 
                    DialButtonColor={'rgba(0, 83, 139, 0.93)'}
                />
            </div>
            <div className = {Styles['Side-Div']} style={{transform: ShowDiv ? "translateX(20%)" : "translateX(120%)"}}>
                <FormComponent 
                    Structure={CreateProductLayout}
                    ReducerState={ProductState}
                    LoadingState={false}
                    SubmitCallback={() => {HandleAddProduct()}}
                />
            </div>
            <ToastContainer />
    </div>
  )
}

export default ProductPage