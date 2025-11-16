import React from 'react'
import { useEffect } from 'react';
import Styles from './TasksPage.module.css'
//Icons
import { GrTasks } from "react-icons/gr";
import { BiTask , BiTaskX } from "react-icons/bi";
import { IoMdCloseCircleOutline } from "react-icons/io";


//Components
import Table from '../../Components/Table/Table.jsx'
import ActionButton from '../../Components/ActionButton/ActionButton.jsx';

//Stores
import useUser from '../../../Stores/UserStore.js';
import useProduct from '../../../Stores/ProductStore.js'

//Methods
import {StateToTable} from '../../../Utils/QueryToObject.js'
import { useState } from 'react';
import ShowToast from '../../Components/Toast/Toast.js'

function TasksPage() {
  const [TaskData , SetTaskData] = useState();
  //Store Destructure
  const {OpenTasks , HandleTaskClient} = useUser();

  const HandleTaskAction = async (TaskType , TaskID) => {
    const IsSuccess = await HandleTaskClient(TaskType , TaskID);
    if(TaskType == "ACCEPT"){
      ShowToast(IsSuccess?.success , IsSuccess?.success == true ? "Request accepted. User joined Org" : "Requested failed. Task persists.");
    }
    else{
      ShowToast(IsSuccess?.success , IsSuccess?.success == true ? "Request rejected successfully" : "Requested failed. Task persists.");
    }
    
  }
  useEffect(() => {
    console.log("This is Open Task"  , OpenTasks);
    let table = StateToTable(OpenTasks , {}  , ['TaskID','RequesterName','RequesterMail','TaskRaisedAt']);

    if(table){
          table = {...table,Columns: [...table.Columns, { ColumnName: "Accept Task", IsEditable: false } , { ColumnName: "Reject Task", IsEditable: false }]};
          for(let Index = 0 ; Index <= table.Rows.length - 1 ; Index += 1){
              table.Rows[Index].push(<ActionButton ButtonColor={'#4A90E2'} Logo={BiTask} Callback={() => {HandleTaskAction("ACCEPT" , table.Rows[Index][0])}} ToolTipText={"Accept"}/>)

              table.Rows[Index].push(<ActionButton ButtonColor={'#e2574aff'} Logo={BiTaskX} Callback={() => {HandleTaskAction("REJECT" , table.Rows[Index][0])}} ToolTipText={"Reject"}/>)
            }
        }
      SetTaskData(table);

  } , [])
  return (
     <div className = {Styles['Main-Div']}>
        <div className = {Styles['Top-Div']}>
        {/* About this page details */}
        <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
            <GrTasks />
            <label className={Styles['Styled-Label']}>Tasks</label>
        </div>
          <div className = {Styles['PageDesc-Div']}>
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Organization joining requests can be found below.</label>
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#097c01ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                      ACCEPT
              </label>
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>
                  or
              </label>
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#9e0000ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                      REJECT
              </label>
          </div>
          </div>
          <div className = {Styles['Mid-Div']}>
            {TaskData ? (
              <Table 
                TableName={'Open Tasks'}
                TableArg={TaskData}
                DisplayOptions = {false}
                Dimensions={['auto' , '10rem']}
            />
            ) : 
              <div className = {Styles['PageDesc-Div']} style={{display:'flex' , flexDirection:'column' ,gap:'2rem' ,backgroundColor:'#6f0000cf' , justifyContent:'center' , alignItems:'center' , borderRadius:'10px' , padding:'2.5rem' , marginTop:'3rem' , width:'20rem' , height:'15rem'}}>
                <IoMdCloseCircleOutline size={'2rem'}/>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                        No Tasks available right now. 
                </label>
              </div>
              
              }
            
          </div>
        </div>
  )
}

export default TasksPage