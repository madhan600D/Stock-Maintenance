import React, { useState , useReducer } from 'react'
import Styles from './Table.module.css'
//Components
import LabelWithLogo from '../LabelWithLogo/LabelWithLogo'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

//Logo
import { TbCategory } from "react-icons/tb";
import { FaEdit } from "react-icons/fa";
import { FaSort } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import { MdOutlineClosedCaptionDisabled } from "react-icons/md";

function Table({TableName , TableArg , ColumnPalette , RowPalette , UpdateButton , RefreshFunction}) {
    //Prop Column:[{Column , IsEditable}]
    //Prop Data:[["data"]]
    //ColumnPalette:{BGColor , TextColor}
    //RowColor:{PrimaryBG , SecondaryBG}
    //UpdateButton:{<Button />}
    //RefreshData:{Function()}
    let TableData;
    const [Loading , SetLoading] = useState(false);

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

            return {...Table,Rows: SortedTable}
        } catch (error) {
            console.log("Error while sorting Array")
            return Table
        }
        finally{
            SetLoading(false)
        }
    }

    //Actions
    const TableActions = Object.freeze({
        EDIT_TABLE: "EDIT_TABLE",
        SORT_TABLE: "SORT_TABLE",
    });
    function Reducer(State , Action){
        switch (Action.type) {
            case TableActions.EDIT_TABLE:
                return 
            case TableActions.SORT_TABLE:
                return SortTable(Action.payload , State)
                
            default:
                return State;
        }

    } 

    const [TableState , Dispatch] = useReducer(Reducer , TableArg) ;
  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['TableInfo-Div']}>
            <TbCategory />
            <label>{TableName}</label>
        </div>
        {/* Column Mapping */}
        <div style={{backgroundColor:ColumnPalette[0] , color:ColumnPalette[1] , gridTemplateColumns:`repeat(${TableState.Columns.length}, 0.3fr)`}} className = {Styles['Header-Div']}>
            {TableState.Columns.map((Column , Idx) => {
                return (
                    <div className = {Styles['Column-Div']} >
                        <div className={Styles['Sort-Div']}>
                            <Tooltip placement='right' title="Sort" arrow>
                            <IconButton onClick={() => {Dispatch({type:TableActions.SORT_TABLE , payload:Column.ColumnName})}}>
                                <FaSort color='bisque'/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        
                        <label>{Column.ColumnName.length < 10 ? Column.ColumnName : `${Column.ColumnName.slice(0)}`}</label>
                    </div>
                )
            })}
        </div>
        {/* Row mapping */}
        <div className={Styles['Body-Div']}>
            {TableState.Rows.length <= 0 && (
                <LabelWithLogo 
                    Logo={MdOutlineClosedCaptionDisabled}
                    Value={"No data!"}
                    BGColor={'red'}
                />
            )}
            {TableState.Rows.map((Row, RowIndex) => (
                <div key={RowIndex} className={Styles['Row-Div']} style={{boxShadow:RowIndex % 2 == 0 ? '0 0 6px #39393997' : 'none' , backgroundColor:RowIndex % 2 == 0 ? RowPalette[0] : RowPalette[1] , color:RowPalette[2] , gridTemplateColumns:`repeat(${TableState.Columns.length}, 0.5fr)`}}>
                    {Row.map((CellData, CellIndex) => (
                        <div className = {Styles['Cell-Div']}>
                            <label className = {Styles['Wrap-Label']} key={CellIndex}>{CellData}</label>
                        </div>
                        
                    ))}
                </div>
            ))}
        </div>

        <div className = {Styles['Bottom-Div']}>
            <Tooltip title="Edit" arrow>
                <IconButton>
                    <FaEdit color='bisque'/>
                </IconButton>
            </Tooltip>

            <Tooltip title="Refresh Data" arrow>
                <IconButton>
                    <FiRefreshCcw color='bisque'/>
                </IconButton>
            </Tooltip>
        </div>
    </div>
  )
}

export default Table