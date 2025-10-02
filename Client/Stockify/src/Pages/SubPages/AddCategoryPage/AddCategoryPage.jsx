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
import ShowToast from '../../Components/Toast/Toast.js'
//Logos
import { TbCategory2 } from "react-icons/tb";
import { GoSidebarExpand } from "react-icons/go";
import { ToastContainer } from 'react-toastify'
function AddCategoryPage() {
    //State
    const [TableData , SetTableData] = useState({});
    const [ShowAddCategory , SetShowAddCategory] = useState(false);
    //Destructure
    const {GetCategory , Category ,AddCategory} = UseProduct();
    //Effects
    useEffect(() => {
        async function CallGetCategory() {
            const IsSuccess = await GetCategory();
            if(IsSuccess){
                const table = await StateToTable(UseProduct.getState().Category, {}); 
                SetTableData(table);
            }
        }   
        CallGetCategory()
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

    //function
    const HandleShowAddForm = () => {
        SetShowAddCategory(Prev => !Prev)
    }
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
        <h3>Categories</h3>
        <div className = {Styles['Top-Div']}>
                {TableData?.Columns && (
            <Table 
            TableName={"CURRENT CATEGORIES"}
            TableArg={TableData}
            RowPalette={["#282a2e" , "#333740ff" , "#ffffffff"]}
            ColumnPalette={["#282a2e" , "#ffffffc2"]}
        />

        )}
            <div>
              {console.log("CatSatte",CatState)}
            <Tooltip title="Add Category" arrow className={Styles['Toggle-Button']}>
            <IconButton onClick={() => HandleShowAddForm()}>
                <GoSidebarExpand color='bisque'/>
            </IconButton>
        </Tooltip>
        </div>
            <div className = {Styles['Test-Div']} style={{transform: ShowAddCategory ? "translateX(20%)" : "translateX(120%)"}}>
            <FormComponent 
              Structure={CreateCategoryLayout}
              ReducerCall={CatReducer}
              ReducerState={CatState}
              LoadingState={false}
              ActionTypes={CatActions}
              SubmitCallback={() => {HandleAddCategory()}}
            />
        </div>
        </div>
        
        
        <ToastContainer />

    </div>
    
  )
}

export default AddCategoryPage