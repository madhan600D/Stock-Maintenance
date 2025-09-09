import React, { useEffect, useState } from 'react'
import Styles from './SideBar.module.css'

import { useLocation, useNavigate } from 'react-router-dom';
//Logos
import { IoMdHome } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { GoOrganization } from "react-icons/go";
import { LuListTodo } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { BiCaretRight } from "react-icons/bi";

import { IoSettings , IoPowerSharp} from "react-icons/io5";
import { FaWindowClose } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineStock } from "react-icons/ai";
import { MdOutlineInventory } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";

//Stores
import useOrg from '../../../Stores/OrgStore';
import useUser from '../../../Stores/UserStore';
import { ToastContainer } from 'react-toastify';
import ShowToast from '../Toast/Toast';

function SideBar() {
  const Location = useLocation()
  //Hooks
 
  const [CurrentURL , SetCurrentURL] = useState();
  const [CurrentMenus , SetCurrentMenus] = useState([]);

  //UseEffects
  useEffect (() => {
    SetCurrentURL(Location.pathname)
    console.log(Location.pathname)
  } , [Location])

  useEffect(() => {
    //Dynamically allocate Menus
    const BuildMenu =  () => {
      //AllocateMenus
      if(CurrentURL == '/home' || CurrentURL == '/'){
        SetCurrentMenus(HomePage.map((menu , index) => {
          return <Menu
            key={index}
            MenuLogo={menu.MenuLogo}
            MenuText={menu.MenuText}
            Callback={menu.Callback}
            ArrayOfSubMenus={menu.ArrayOfSubMenus || []}
          />
        }))
      }
      else if(CurrentURL == '/join-org' || CurrentURL == '/create-org'){
        SetCurrentMenus(CreateOrJoinOrg.map((menu , index) => {
          return <Menu
            key={index}
            MenuLogo={menu.MenuLogo}
            MenuText={menu.MenuText}
            Callback={menu.Callback}
            ArrayOfSubMenus={menu.ArrayOfSubMenus || []}
          />
        }))
        
      }
      else{
          SetCurrentMenus([])
        }
      
    }

    BuildMenu()
    
  } , [CurrentURL])
  //SideBar Functions
  const HandleInviteToOrgClick = async () => {
      navigate('/invite-to-org')
  }
  const HandleLogout = async () => {
    console.log("Logout method called")
    const res = await Logout()
    ShowToast({success:res.success , message:res.message})
  }
  //Dynamic SideBar
  const HomePage = [{
    MenuLogo: MdOutlineInventory,
    MenuText: "Inventory"
  },
  {
    MenuLogo: GoOrganization,
    MenuText: "Organization",
    ArrayOfSubMenus: [
      { MenuText: "Invite to org", Callback: HandleInviteToOrgClick },
      { MenuText: "Edit Organization" }
    ]
  },
  {
    MenuLogo: AiOutlineStock,
    MenuText: "Stock",
    ArrayOfSubMenus: [
      { MenuText: "ForeCast Stocks" },
      { MenuText: "Stock Settings" }
    ]
  },
  {
    MenuLogo: FaUsers,
    MenuText: "Users",
    ArrayOfSubMenus: [
      { MenuText: "User Management" },
      { MenuText: "Group Buzz" },
      { MenuText: "Chat" }
    ]
  },
  {
    MenuLogo: TbReportAnalytics,
    MenuText: "Reports",
    ArrayOfSubMenus: [
      { MenuText: "CurrentDay Report" },
      { MenuText: "PNL Report" },
      { MenuText: "History Data" }
    ]
  },
  {
    MenuLogo: FaTasks,
    MenuText: "Tasks"
  },
  {
    MenuLogo: CgProfile,
    MenuText: "Profile",
    ArrayOfSubMenus: [
      { MenuText: "Edit Profile" },
      { MenuText: "Update Profile" }
    ]
  },
  {
    MenuLogo: IoSettings,
    MenuText: "Settings"
  },
  {
    MenuLogo: IoPowerSharp,
    MenuText: "Logout",
    Callback:HandleLogout
  }]

  const CreateOrJoinOrg = [{
    MenuLogo: CgProfile,
    MenuText: "Profile",
    ArrayOfSubMenus: [
      { MenuText: "Edit Profile" },
      { MenuText: "Update Profile" }
    ]
  },
  {
    MenuLogo: IoSettings,
    MenuText: "Settings"
  },
  {
    MenuLogo: IoPowerSharp,
    MenuText: "Logout",
    Callback:HandleLogout
  }]
  
  

  //Destructure
  const navigate = useNavigate();
  const {OrganizationData } = useOrg();
  const {Logout} = useUser();
  const MaxTextLimit = 10;
  if(CurrentMenus?.length > 1){
    return (
    <div className = {Styles['Main-Div']}>
      <div className = {Styles['Top-Div']}>
        <label>
          E-Nventory
        </label>
        <FaWindowClose className={Styles['SideBar-Svg']} />
      </div>
      <div className = {Styles['Content-Div']}>
        {CurrentMenus}
      </div>
      <div className = {Styles['Footer-Div']}>
        <ToastContainer />
      </div>
    </div>
  )
  }
  
}



function Menu({MenuLogo , MenuText , ArrayOfSubMenus , Callback}){
  //States
  const [SubMenuVisible , SetSubMenuVisible] = useState('0fr');

  //Functions
  const HandleDropDown = async () => {
    SetSubMenuVisible((prev) => (prev === '0fr' ? '1fr' : '0fr'));
    Callback()
  }

  const HandleCallBack = async () => {
    if(ArrayOfSubMenus?.length < 0){
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