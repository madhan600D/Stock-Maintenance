import React, { useState } from 'react'
import Styles from './SideBar.module.css'

import { useNavigate } from 'react-router-dom';
//Logos
import { IoMdHome } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { GoOrganization } from "react-icons/go";
import { LuListTodo } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { BiCaretRight } from "react-icons/bi";
import { IoSettings } from "react-icons/io5";
import { FaWindowClose } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineStock } from "react-icons/ai";
import { MdOutlineInventory } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";

//Stores
import useOrg from '../../../Stores/OrgStore';

function SideBar() {
  //Hooks
  const navigate = useNavigate();

  //SideBar Functions
  const HandleInviteToOrgClick = async () => {
      navigate('/invite-to-org')
  }

  //Destructure

  const {OrganizationData} = useOrg();
  const MaxTextLimit = 10;
  return (
    <div className = {Styles['Main-Div']}>
      <div className = {Styles['Top-Div']}>
        <label>
          E-Nventory
        </label>
        <FaWindowClose className={Styles['SideBar-Svg']} />
      </div>
      <div className = {Styles['Content-Div']}>
        <Menu 
          MenuLogo={MdOutlineInventory}
          MenuText={"Inventory"}
        />
        <Menu 
          MenuLogo={GoOrganization}
          MenuText={"Organization"}
          ArrayOfSubMenus={[
              {MenuText:"Invite to org" , Callback:HandleInviteToOrgClick },
              {MenuText:"Edit Organization"}
            ]}   
        />
        <Menu 
          MenuLogo={AiOutlineStock}
          MenuText={"Stock"}
          ArrayOfSubMenus={[
              {MenuText:"ForeCast Stocks"},
              {MenuText:"Stock Settings"}
            ]}   
        />
        <Menu 
          MenuLogo={FaUsers}
          MenuText={"Users"}
          ArrayOfSubMenus={[
              {MenuText:"User Management"},
              {MenuText:"Group Buzz"},
              {MenuText:"Chat"}
            ]}      
        />
        <Menu 
          MenuLogo={TbReportAnalytics}
          MenuText={"Reports"}
          ArrayOfSubMenus={[
              {MenuText:"CurrentDay Report"},
              {MenuText:"PNL Report"},
              {MenuText:"History Data"}
            ]}      
        />
        <Menu 
          MenuLogo={FaTasks}
          MenuText={"Tasks"}
        />
        <Menu 
          MenuLogo={CgProfile}
          MenuText={"Profile"}
          ArrayOfSubMenus={[
              {MenuText:"Edit Profile"},
              {MenuText:"Update Profile"}
            ]}      
        />
        <Menu 
          MenuLogo={IoSettings}
          MenuText={"Settings"}
        />
      </div>
      <div className = {Styles['Footer-Div']}>
        Footer
      </div>
    </div>
  )
}



function Menu({MenuLogo , MenuText , ArrayOfSubMenus , Callback}){
  //States
  const [SubMenuVisible , SetSubMenuVisible] = useState('0fr');

  //Functions
  const HandleDropDown = async () => {
    SetSubMenuVisible((prev) => (prev === '0fr' ? '1fr' : '0fr'));
  }

  const HandleCallBack = async () => {
    if(ArrayOfSubMenus?.length < 0 || ! ArrayOfSubMenus){
      Callback()
    } 
  }
  return (
    <div className = {Styles['AllMenu-Div']}>
      <div className = {Styles['Menu-Div']} onClick={() => HandleDropDown()}>
          
          <MenuLogo className = {Styles['Logo-Svg']}/>
          <label>
            {MenuText}
          </label>
          <div style={{ transform: SubMenuVisible === '0fr' ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 0.3s ease'}} className= {Styles['Arrow-Svg']}>
              {ArrayOfSubMenus?.length > 0 ? <IoIosArrowDown /> : ''}
          </div>
      </div>
      <div className = {Styles['SubMenu-Main']} style={{gridTemplateRows:SubMenuVisible}}>
        <div>
            {ArrayOfSubMenus?.length > 0 ? ArrayOfSubMenus.map((SubMenuObject) => 
            <SubMenu MenuText={SubMenuObject.MenuText} ShowSubMenu={SubMenuVisible} Callback={SubMenuObject.Callback} />) : ""}
        </div>
        
      </div>
    </div>
  )
}

function SubMenu({MenuText , Callback}){
  const MaxTextLimit = 20;
  const HandleSubMenuCallBack = async () =>{
    Callback()

  }
  return (
    <div className = {Styles['SubMenu-Div']} onClick={HandleSubMenuCallBack}>
      <BiCaretRight />
      <label className = {Styles['SubMenu-Lbl']}>
        {MenuText?.length > MaxTextLimit ? MenuText.slice(0 , MaxTextLimit) + "..." : MenuText}
      </label>
    </div>
  )
}

export default SideBar