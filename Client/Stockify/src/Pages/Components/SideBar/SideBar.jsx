import React, { useEffect, useState } from 'react'
import Styles from './SideBar.module.css'

import { useLocation, useNavigate } from 'react-router-dom';
//Logos
import { GoOrganization } from "react-icons/go";

import { IoIosArrowDown } from "react-icons/io";
import { BiCaretRight } from "react-icons/bi";
import { IoMdPaper } from "react-icons/io";

import { IoSettings , IoPowerSharp} from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";

import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineStock } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import { PiPresentationChartFill } from "react-icons/pi";

import { MdOutlineInventory } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import EnventoryLogo from '../../../assets/Logo/EnventoryLogo.png'
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa6";

//Stores
import useOrg from '../../../Stores/OrgStore.js';
import useUser from '../../../Stores/UserStore.js';
import useApp from '../../../Stores/AppStore.js';
import { ToastContainer } from 'react-toastify';
import ShowToast from '../Toast/Toast';

function SideBar() {
  const Location = useLocation()
  const {CurrentPage , SetCurrentPage , SideBarState} = useApp();
  //Hooks
  const [CurrentURL , SetCurrentURL] = useState();
  const [CurrentMenus , SetCurrentMenus] = useState([]);

  function HandleSubPageChange (SubURL) {
    //Calls SetCurrentPage from AppStore
    SetCurrentPage(SubURL)
    
  }



  //UseEffects
  useEffect (() => {
    SetCurrentURL(Location.pathname)
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
            URL={menu.URL || ''}
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
  // const HandleInviteToOrgClick = async () => {
  //     navigate('/invite-to-org')
  // }
  const HandleLogout = async () => {
    console.log("Logout method called")
    const res = await Logout()
    ShowToast({success:res.success , message:res.message})
  }
  //Dynamic SideBar
  const HomePage = [{
    MenuLogo: MdOutlineInventory,
    MenuText: "Dashboard",
    Callback:HandleSubPageChange,
    URL:'/dashboard'
  },
  {
    MenuLogo: GoOrganization,
    MenuText: "Organization",
    Callback:HandleSubPageChange,
    URL:'/orgpage'
  },
  {
    MenuLogo: PiPresentationChartFill,
    MenuText: "Inventory",
    ArrayOfSubMenus: [
      { MenuText: "Products" ,Callback:HandleSubPageChange , URL:'/products' },
      { MenuText: "Category" , Callback:HandleSubPageChange , URL:'/category' }
    ]
  },
  {
    MenuLogo: FaCartArrowDown,
    MenuText: "Orders",
    URL:'/orders',
    Callback:HandleSubPageChange
  },
  {
    MenuLogo: FaUsers,
    MenuText: "Users",
    ArrayOfSubMenus: [
      { MenuText: "User Management" },
      { MenuText: "Tasks" , Callback:HandleSubPageChange , URL:'/tasks' },
    ]
  },
  {
    MenuLogo: TbReportAnalytics,
    MenuText: "Vendors",
    Callback:HandleSubPageChange,
    URL:'/vendors'
  },
  {
    MenuLogo: IoMdPaper,
    MenuText: "Check out",
    Callback:HandleSubPageChange,
    URL:'/checkouts'
  },
  {
    MenuLogo: AiOutlineInfoCircle,
    MenuText: "Info",
    URL:'/info',
    Callback:HandleSubPageChange
  },
  {
    MenuLogo: IoPowerSharp,
    MenuText: "Logout",
    Callback:HandleLogout
  }]

  const CreateOrJoinOrg = [
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
  if(CurrentMenus?.length > 0){
    return (
      <div className = {Styles['Main-Div']} style={{width: SideBarState === "OPEN" ? '20%' : '0%'}}>
        <div className = {Styles['Top-Div']}>
          <div className={Styles['logo']}>
            <img src = {EnventoryLogo} alt="ENventory Logo" className={Styles['']} />
          </div>
          {/* <FaWindowClose className={Styles['SideBar-Svg']} /> */}
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



function Menu({MenuLogo , MenuText , ArrayOfSubMenus , Callback , URL}){
  //States
  const [SubMenuVisible , SetSubMenuVisible] = useState('0fr');
  const UniqueID = URL;
  //Functions
  const HandleDropDown =  () => {
    if(ArrayOfSubMenus.length === 0){
      Callback(UniqueID);
    }
    else{
      SetSubMenuVisible((prev) => (prev === '0fr' ? '1fr' : '0fr'));
    }
    
    
  }

  return (
    <div className = {Styles['AllMenu-Div']}>
      <div className = {Styles['Menu-Div']} onClick={() => {
              HandleDropDown()
        }}>
          
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
            <SubMenu MenuText={SubMenuObject.MenuText} ShowSubMenu={SubMenuVisible} Callback={SubMenuObject.Callback} URL={SubMenuObject.URL} />) : ""}
        </div>
        
      </div>
    </div>
  )
}

function SubMenu({MenuText , Callback , URL}){
  const MaxTextLimit = 20;
  const SubURL = URL
  const HandleSubMenuCallBack =  () =>{
    console.log("Called Sub CB")
    Callback(SubURL)
  }
  return (
    <div className = {Styles['SubMenu-Div']} onClick={HandleSubMenuCallBack}>
      <GoDotFill />
      <label className = {Styles['SubMenu-Lbl']}>
        {MenuText?.length > MaxTextLimit ? MenuText.slice(0 , MaxTextLimit) + "..." : MenuText}
      </label>
    </div>
  )
}

export default SideBar