import React from 'react'
import Styles from './DashboardPage.module.css'
//Components
import LabelWithLogo from '../../Components/LabelWithLogo/LabelWithLogo.jsx'

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
    </div>
  )
}

export default DashboardPage