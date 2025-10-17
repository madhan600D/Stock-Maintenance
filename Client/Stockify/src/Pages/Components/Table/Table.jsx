import React, { useState , useReducer , useEffect } from 'react'
import Styles from './Table.module.css'
//Components
import LabelWithLogo from '../LabelWithLogo/LabelWithLogo'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider } from '@emotion/react';
import TextField from '@mui/material/TextField';
import { createTheme } from '@mui/material/styles';
//Logo
import { TbCategory } from "react-icons/tb";
import { FaEdit } from "react-icons/fa";
import { FaSort } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import { MdOutlineClosedCaptionDisabled } from "react-icons/md";
import { MdOutlineManageSearch } from "react-icons/md";


function Table({TableName , TableArg , ColumnPalette , RowPalette , UpdateButton , RefreshFunction , Dimensions = ["max-content" , "max-content"] , DisplayOptions = true}) {
    //Prop Column:[{Column , IsEditable}]
    //Prop Data:[["data"]]
    //ColumnPalette:{BGColor , TextColor}
    //RowColor:{PrimaryBG , SecondaryBG}
    //UpdateButton:{<Button />}
    //RefreshData:{Function()}
    let TableData;
    const [Loading , SetLoading] = useState(false);
    const [Query , SetQuery] = useState();
    const ColumnPixel = []

    
    //Reducer Functions
    function SortTable(ColToSort , Table){

        SetLoading(true)
        try {
            
            let SortedTable = [...Table.Rows] 
            //Find the column's index
            const ColIndex = Table.Columns.findIndex(Value => Value.ColumnName === ColToSort);
            //Check for Number

            //BubbleSort
            SortedTable.sort((a , b) => {
                if(typeof a[ColIndex] == "number"){
                    return a[ColIndex] - b[ColIndex]    
                }
                return a[ColIndex].localeCompare(b[ColIndex]); 
            })

            return {...Table, Rows: SortedTable}
        } catch (error) {
            console.log("Error while sorting Array")
            return Table
        }
        finally{
            SetLoading(false)
        }
    }
    function FilterTable(Data , Table){
        SetLoading(true)
        try {
            let FilteredRow = [...Table.Rows]

            const Query = String(Data).toLowerCase()

            FilteredRow = Table.Rows.filter(Row => {
                return(
                    Row.some((Cell) => {
                        if (Cell == null) return false;

                        const Value = String(Cell).toLowerCase();

                        if(Value.includes(Query)) return true


                    }))
                }) 
            return {...Table , Rows:FilteredRow}
        } catch (error) {
            SetLoading(false)
        }
    }

    //Actions
    const TableActions = Object.freeze({
        EDIT_TABLE: "EDIT_TABLE",
        SORT_TABLE: "SORT_TABLE",
        FILTER_TABLE:"FILTER_TABLE",
        REFRESH_TABLE:"REFRESH_TABLE"

    });
    function Reducer(State , Action){
        switch (Action.type) {
            case TableActions.EDIT_TABLE:
                return 
            case TableActions.SORT_TABLE:
                return SortTable(Action.payload , State)
            case TableActions.FILTER_TABLE:
                return FilterTable(Action.payload , State)
            case TableActions.REFRESH_TABLE:
                return TableArg
            default:
                return State;
        }

    } 

    const [TableState , Dispatch] = useReducer(Reducer , TableArg);
    //Effect
    useEffect(() => {
        TableState.Columns.map((Col , Idx) => {ColumnPixel.push(Col.Col?.length * 20)}) 
    }, [TableState]);
    //Theme
    const FilterBox = createTheme({
        components: {
            MuiTextField: {
            styleOverrides: {
                root: {
                width: "100%",
                color: "white",
                },
            },
            },
            MuiOutlinedInput: {
            styleOverrides: {
                root: {
                color: "#c0c0c0ff",
                display: "flex",
                
                alignItems: "center", // keep text vertically centered
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
                    color: "#5A7DC4",
                    padding: "0.15rem 0.2rem",
                    height: "max-content",  
                     
                    boxSizing: "content-box",
                },
                },
            },
            },
            MuiInputLabel: {
            styleOverrides: {
                root: {
                display:'flex',
                color: "white",
                "&.Mui-focused": {
                    color: "#5A7DC4",
                },
                },
            },
            },
        },
        });


  return (
    <div className = {Styles['Main-Div']} style={{width:Dimensions[0] , height:Dimensions[1]}}>
        <div className = {Styles['TableInfo-Div']}>
            <TbCategory />
            <label>{TableName}</label>
            {DisplayOptions && (
                <div className = {Styles['Bottom-Div']}>
                <div style={{display:'inline-block' , height:'100%' , marginLeft:'0.5rem' }}>
                    <ThemeProvider theme={FilterBox}>
                    <TextField
                        size='small'
                        id="outlined-basic"
                        label="Search"
                        onChange={(Data) => SetQuery(Data.target.value)}
                        variant="outlined"
                    />
                    </ThemeProvider>
                </div>
            <Tooltip title="Search" arrow>
                <IconButton onClick={() => Dispatch({ type: TableActions.FILTER_TABLE, payload: Query })}>
                    <MdOutlineManageSearch color="bisque" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Edit" arrow>
                <IconButton>
                    <FaEdit color='bisque'/>
                </IconButton>
            </Tooltip>

            <Tooltip title="Refresh" arrow>
                <IconButton onClick={() => Dispatch({type: TableActions.REFRESH_TABLE})}> 
                    <FiRefreshCcw color='bisque'/>
                </IconButton>
            </Tooltip>
        </div>
            )}
            
        </div>
        {/* Column Mapping */}
        <div className = {Styles['Table-Div']}>
            <table
                cellPadding="6"
                cellSpacing="0"
                style={{ borderCollapse: "collapse", width: "100%", fontFamily: "Arial, sans-serif", fontSize: "14px"}}
                className= {Styles['Table']}
                >
                <thead className= {Styles['Table-Head']}>
                    <tr style={{color: "rgba(127, 133, 139, 0.73)" , fontWeight:'bolder' }} >
                    {TableState && TableState.Columns.map((Column , Idx) => (
                        <>
                        <th onClick={() => {Dispatch({type:TableActions.SORT_TABLE , payload:Column.ColumnName})}}>{Column.ColumnName}</th>
                        </>
                    ))}
                    </tr>
                </thead>
                <tbody className= {Styles['Table-Body']}>
                    {TableState.Rows && TableState.Rows.map(
                        (Row , Index) => (
                            <tr>
                                {Row && Row.map((CellData , CellIndex) => (
                                    <td key={CellIndex}>{CellData}</td>
                                ))}
                            </tr>
                        )
                    )}
                    
                </tbody>
                </table>
        </div>

        
    </div>
  )
}

export default Table