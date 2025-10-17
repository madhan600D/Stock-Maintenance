import React , {useReducer, useRef} from 'react'
import Styles from './AddCategoryPage.module.css'
import Table from '../../Components/Table/Table.jsx'
import { useEffect } from 'react'

//Stores
import UseProduct from '../../../Stores/ProductStore.js'
import { useState } from 'react'
import { StateToTable } from '../../../Utils/QueryToObject.js'
import LabelWithLogo from '../../Components/LabelWithLogo/LabelWithLogo.jsx'

//Components
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import FormComponent from '../../Components/FormComponent/FormComponent.jsx'
import TextBoxWithLogo from '../../Components/TextBoxWithLogo/TextBoxWithLogo.jsx'
import { ThemeProvider } from '@emotion/react'
import TextField from '@mui/material/TextField'
import { createTheme } from '@mui/material/styles'
import SimpleButton from '../../Components/SimpleButton/SimpleButton.jsx'
import ShowToast from '../../Components/Toast/Toast.js'
//Logos
import { TbCategory2 } from "react-icons/tb";
import { GoSidebarExpand } from "react-icons/go";
import { FaLayerGroup } from "react-icons/fa6";
import { ToastContainer } from 'react-toastify'
import { MdFormatListBulleted } from "react-icons/md";
function AddCategoryPage() {
    //State
    const [TableData , SetTableData] = useState({});
    const FormRef = useRef();
    const [ShowAddCategory , SetShowAddCategory] = useState(false);
    //Destructure
    const {GetCategory , Category ,AddCategory} = UseProduct();
    //Effects
    useEffect(() => {
        function CallGetCategory() {
            const table = StateToTable(Category, {} , ['CategoryID' , 'CategoryName' , 'CategoryDescription']); 
            SetTableData(table);
            
        }   
        CallGetCategory()
    } , [])
    //Events
      useEffect(() => {
          const HandleClick = (Event) => {
              if(FormRef.current && !FormRef.current.contains(Event.target)){
                  FormRef.current.value = ""
                  SetShowAddCategory(false);
              }
          }
          document.addEventListener("mousedown" , HandleClick);
          return () => document.removeEventListener("mousedown", HandleClick);
      } , [])
    //Theme
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
    const HandleAddCategory = async () => {
        try {
            const IsSuccess = await AddCategory(CatState)
            if(IsSuccess.success){
              ShowToast(true , IsSuccess.message)
            }
            else{
              ShowToast(false , IsSuccess.message)
            }
        } catch (error) {
            
        }
    }
    const InitialState = {CategoryName:"" , CategoryDescription:"" , CategoryImage:""}

    const CatActions = Object.freeze({
        SET_CATEGORY_NAME: "SET_ORGANIZATION_NAME",
        SET_CATEGORY_DESCRIPTION: "SET_TYPE_OF_BUSINESS",
        SET_CATEGORY_IMAGE: "SET_ADDRESS_STREET",
    });
    const CatReducer = (State , Action) => {
        switch (Action.type){
        case CatActions.SET_CATEGORY_NAME:
            return {
            ...State , CategoryName:Action.payload
            }
        case CatActions.SET_CATEGORY_DESCRIPTION:
            return {
            ...State , CategoryDescription:Action.payload
            }
        case CatActions.SET_CATEGORY_IMAGE:
            return {
            ...State , CategoryImage:Action.payload
            }
        default:
            return State;
        
        }
    }
  const CategoryNameRef = useRef()
  const [CatState , Dispatch] = useReducer(CatReducer , InitialState);
    const CreateCategoryLayout = {
      "Add New Category": [
        {
          "": {
            ArrayOfElements: [
              <TextBoxWithLogo
                Logo={TbCategory2}
                IsMandatory={false}
                FloatingText="Category Name"
                DataProp={CatState.CategoryName}
                Type="STRING"
                Reference={CategoryNameRef}
                ColorPallete={["#313a4bff", "#01617eff"]}
                TBCallBack={(Data) => {Dispatch({ type: CatActions.SET_CATEGORY_NAME , payload: Data })}}
              />,
                <div style={{ width: "100%" }}>
                    <ThemeProvider theme={DescBox}>
                    <TextField
                        id="outlined-basic"
                        label="About category"
                        multiline
                        onChange={(Data) => {Dispatch({ type: CatActions.SET_CATEGORY_DESCRIPTION , payload: Data.target.value })}}
                        variant="outlined"
                    />
                    </ThemeProvider>
                </div>
            ],
            GridSpan: 1,
          },
        }, 
      ],
    };
    
  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['Top-Div']}>
            {/* About this page details */}
            <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                <FaLayerGroup />
                <label className={Styles['Styled-Label']}>Category</label>
            </div>
            <div className = {Styles['Simple-Button']}>
              <SimpleButton
                ButtonText={"ADD Category"}
                BGColor={"#0f9ec6ff"}
                Dimensions={[10, 3]}
                Callback={() => {SetShowAddCategory(true)}}
              />
            </div>          
          </div>
          <div className = {Styles['PageDesc-Div']} style={{marginBottom:'2rem'}}>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Add and maintain your org inventory groups(Category) in this page. Add new category by clicking:</label>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#027aa6ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                        Add Category
                </label>
            </div>
        <div className = {Styles['Top-Div']} style={{width:'100%'}}>
            {/* About this page details */}
            <div style={{display:'flex' ,flexDirection:'column' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px' , width:'100%'}}>
                <MdFormatListBulleted />
                <label style={{fontSize:'1rem'}} className={Styles['Styled-Label']}>Category List</label>
            <div style={{display:'flex' , gap:'1rem' , width:'100%'}}>
                {TableData && TableData?.Columns &&(
                  <Table 
                  TableName={"Categories"}
                  TableArg={TableData}
                  Dimensions={["100%" , ""]}
                />
                )}
              </div>
            </div>
          </div>
          
            <div className = {Styles['Side-Div']} style={{transform: ShowAddCategory ? "translateX(20%)" : "translateX(120%)"}}>
              
            <FormComponent 
              Structure={CreateCategoryLayout}
              ReducerCall={CatReducer}
              ReducerState={CatState}
              Reference={FormRef}
              LoadingState={false}
              ActionTypes={CatActions}
              SubmitCallback={() => {HandleAddCategory()}}
            />
        </div>
        
        
        <ToastContainer />

    </div>
    
  )
}

export default AddCategoryPage