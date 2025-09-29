import React from 'react'
import Styles from './DashboardPage.module.css'

//Components
import LabelWithLogo from '../../Components/LabelWithLogo/LabelWithLogo.jsx'
import Table from '../../Components/Table/Table.jsx';

//Logos
import { CgProfile } from 'react-icons/cg'
import { MdWindow } from "react-icons/md";
import { BsBoxes } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";


function DashboardPage() {
  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['OrgData-Div']}>
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
          <Table
              TableArg={{Columns:[
                { Column: "Id", IsEditable: false },
                { Column: "Name", IsEditable: true },
                { Column: "Age", IsEditable: true },
                { Column: "Gender", IsEditable: false },
                { Column: "Email", IsEditable: true },
                { Column: "Department", IsEditable: false },
                { Column: "Joining Date", IsEditable: false },
                { Column: "Salary", IsEditable: true }], 
                Rows:[
                  [1, "Madhan", 23, "Male", "madhan@example.com", "Engineering", "2022-03-15", "₹60,000"],
                  [2, "Kumar", 27, "Female", "veni@example.com", "Marketing", "2021-11-10", "₹50,000"],
                  [3, "Arun", 27, "Female", "veni@example.com", "Marketing", "2021-11-10", "₹50,000"]
                ]}}
          
          
  RowPalette={["#858585c2" , "#444444ff" , "bisque"]}
  ColumnPalette={["#375158c2" , "#ffffffc2"]}
  TableName={"EMPLOYEE DATA WITH SALARY"}
/>


    </div>
  )
}

export default DashboardPage