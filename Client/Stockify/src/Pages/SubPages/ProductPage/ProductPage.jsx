import React, { useRef, useState , useReducer, useEffect} from 'react'
import Styles from './ProductPage.module.css'
import { StateToTable } from '../../../Utils/QueryToObject.js'

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
import { MdOutlineInventory } from "react-icons/md";
import { AiOutlineDollar } from "react-icons/ai";
import { IoIosClose } from 'react-icons/io'
import { FaTrophy } from "react-icons/fa6";
import { FaCartArrowDown } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import { CiViewTable } from "react-icons/ci";
import { FaCubesStacked } from "react-icons/fa6";
import { ImStack } from "react-icons/im";

//Stores
import UseProduct from '../../../Stores/ProductStore.js';
import dayjs from 'dayjs'
import ShowToast from '../../Components/Toast/Toast.js'
import Tooltip from '@mui/material/Tooltip'
import { ToastContainer } from 'react-toastify'
import Card from '@mui/material/Card'
import ProductCard from '../../Components/Card/ProductCard.jsx'
import PageSelector from '../../Components/PageSelector/PageSelector.jsx'
import Table from '../../Components/Table/Table.jsx'

function ProductPage() {
        //States
        const [ShowDiv , SetShowDiv] = useState(false);
        const [TableData , SetTableData] = useState();
        const [MostSelling , SetMostSelling] = useState();
        const [OutOfStock , SetOutOfStock] = useState(0);
        const FormRef = useRef();
        //Login --> Stack , Signup --> Table
        const [CurrentView , SetCurrentView] = useState("Login");
        const {Category , Vendors  , Products , Currency , AddProduct , HighSellingProducts}  = UseProduct();
        const ProductNameRef = useRef();
        const ProductImageRef = useRef();

        //Effects
        useEffect(() => {
          const table =  StateToTable(UseProduct.getState().Products, {} , ['ProductID' , 'ProductName' , 'Quantity']); 
          SetTableData(table)
          const MostSeller = StateToTable(UseProduct.getState().HighSellingProducts , {} , ['ProductID' , 'ProductName' , 'Quantity' , 'Price'])
          SetMostSelling(MostSeller)
          
        } , [])
        //Events
        useEffect(() => {
            const HandleClick = (Event) => {
                if(FormRef.current && !FormRef.current.contains(Event.target)){
                    FormRef.current.value = ""
                    SetShowDiv(false);
                }
            }
            document.addEventListener("mousedown" , HandleClick);
            return () => document.removeEventListener("mousedown", HandleClick);
        } , [])
        useEffect(() => {
            let LowStockCount = 0
            for(let P of Products[0]){
              if(P.Quantity < P.ReorderThreshold){
                LowStockCount += 1
              }
            }
            SetOutOfStock(LowStockCount)
        } , [Products])
        const InitialState = {ProductName:"" , ProductPrice:0 , Currency:'' ,ActualPrice:0  , CategoryName:'' , ProductImage:"" , VendorName:'' , ExpirationDate:'' , ReorderThreshold:0 , Unit:"" ,Quantity:0}

        //Functions
        const HandleAddProduct = async() => {
          try {
            const IsSuccess = await AddProduct(ProductState);
  
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
              } , "Product Image":{
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
       <div className = {Styles['Top-Div']}>
                   {/* About this page details */}
                   <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                       <FaCartArrowDown />
                       <label className={Styles['Styled-Label']}>Products</label>
                   </div>
                   <div className = {Styles['Simple-Button']}>
                      <SimpleButton
                       
                        ButtonText={"ADD PRODUCT"}
                        BGColor={"#0f9ec6ff"}
                        Dimensions={[10, 3]}
                        Callback={() => {SetShowDiv(true)}}
                      />
                   </div>          
          </div>
           <div className = {Styles['PageDesc-Div']} style={{marginBottom:'2rem'}}>
                      <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>View and maintain your org inventory in this page. Add new product by clicking:</label>
                      <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#027aa6ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                              Add Product 
                      </label>
                      <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>
                          Edit product details in the below:  
                      </label>
                      <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e7032ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>stack view edit</label>
                      <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>button.</label>
                          
                  </div>
            <div className= {Styles['Top-Div']} style={{backgroundColor:'#13171d84' , padding:'1.5rem',borderRadius:'20px' ,display:'flex' , flexDirection:'column'}}>
              <div>
                  <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                       <MdOutlineInventory />
                       <label style={{fontSize:'small'}} className={Styles['Styled-Label']}>Dashboard</label>
                   </div>
              </div>
              <div style={{display:'flex' , flexDirection:'row' ,gap:'0.6rem' , alignItems:'center' , justifyContent:'center'}}>
                <LabelWithLogo 
                    Logo={FaBoxOpen}
                    Header={"Total Products"}
                    Value={Products[0].length || "NA"}
                    BGColor={'#282f31ff'}
                    Dimension={[250 , 100]}
                />
                <LabelWithLogo 
                    Logo={IoWarningOutline}
                    Header={"Low Stock Products"}
                    Value={OutOfStock}
                    BGColor={'#ff6c6cff'}
                    Dimension={[250 , 100]}
                />
                <LabelWithLogo 
                    Logo={FaTrophy}
                    Header={"Top Seller"}
                    Value={HighSellingProducts[0][0].ProductName}
                    BGColor={'#a5ff7bff'}
                    Dimension={[250 , 100]}
                />
              </div>
                

            </div>
            <div className = {Styles['Display-Div']}>
              <div className = {Styles['DisplayTop-Div']}>
                <div className = {Styles['TopLeft-Div']}>
                  <label className={Styles['Styled-Label']}>Inventory</label>
                  <ImStack />
                </div>
                <PageSelector 
                  PageHeader={[<FaCubesStacked /> , <CiViewTable />]}
                  CurrentPage={CurrentView}
                  SetCurrentPage={SetCurrentView}
                  Dimension={['10rem' , 'auto']}
                />
              </div>
              {/* Login --> Stack , Signup --> Table */}
              
              <div className = {Styles['View-Div']}>
                {CurrentView === "Login" ? (
                    // Stack View
                    Products && Products[0] && Products[0].map((Product) => (
                      <ProductCard
                        key={Product.ProductID}
                        ProductID={Product.ProductID}
                        ProductName={Product.ProductName}
                        ProductImage={Product.ProductImage}
                        ProductPrice={Product.ProductPrice}
                        ActualPrice={Product.ActualPrice}
                        Quantity={Product.Quantity}
                        Unit={Product.Unit}
                        VendorName={Vendors[0]?.find(v => v.VendorID === Product.VendorID)?.VendorName}
                        ReorderThreshold={Product.ReorderThreshold}
                        Dimensions={['15rem', 'max-content']}
                      />
                    ))
                  ) : (
                    // Table View
                    <div className = {Styles['Table-Div']} style={{width:'100%'}}>
                      <Table 
                        TableName={'ALL PRODUCTS'}
                        TableArg={TableData}
                        ColumnPalette={["#1c1d1fff" , "white"]}
                        RowPalette={["#161A20" , "#1E232B" , "white"]}
                        Dimensions={["100%" , ""]}
                      />
                    </div>
                    
                  )}

                    
              </div>
              
              

            </div>
            <div className = {Styles['Side-Div']} style={{transform: ShowDiv ? "translateX(20%)" : "translateX(120%)"}}>
                <FormComponent 
                    Reference={FormRef}
                    Structure={CreateProductLayout}
                    ReducerState={ProductState}
                    LoadingState={false}
                    SubmitCallback={() => {HandleAddProduct()}}
                />
            </div>
            <ToastContainer />
            <div className= {Styles['Top-Div']} style={{backgroundColor:'#13171d84' , padding:'1.5rem',borderRadius:'20px' ,display:'flex' , flexDirection:'column' , marginTop:'2rem'}}>
                <div>
                    <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                        <AiOutlineDollar />
                        <label style={{fontSize:'small'}} className={Styles['Styled-Label']}>Inventory Flow</label>
                    </div>
                </div>
                <div style={{display:'flex' , gap:'1rem'}}>
                  {MostSelling && (
                    <Table 
                    TableName={"Most Selling Products"}
                    TableArg={MostSelling}
                    Dimensions={["100%" , ""]}
                  />
                  )}
                  
                </div>
              </div>
    </div>
  )
}

export default ProductPage