import React, { useState } from 'react'
import Styles from './InfoPage.module.css'

//Icons
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { FaReact } from "react-icons/fa";
import { FaNodeJs } from "react-icons/fa6";
import { SiExpress } from "react-icons/si";
import { SiSequelize } from "react-icons/si";
import { SiApachekafka } from "react-icons/si";
import { FaMailBulk } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { TbBrandSocketIo } from "react-icons/tb";
import { SiFoodpanda } from "react-icons/si";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { GiToken } from "react-icons/gi";
import { FaSmileWink } from "react-icons/fa";

//Images
import Architecture from '../../../assets/Resource/Diagram.svg'


//Components
import EnventoryLogo from '../../Components/EnventoryLogo/EnventoryLogo.jsx'

function InfoPage() {
  const [BODropDown , SetBODropDown] = useState(false);
  const [FeatureDD , SetFeatureDD] = useState(false);
  const [TechDD , SetTechDD] = useState(false);
  const [AboutDD , SetAboutDD] = useState(false);
  return (
    <div className = {Styles['Main-Div']}>
       <div className = {Styles['Top-Div']}>
            {/* About this page details */}
            <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                <AiOutlineInfoCircle />
                <label className={Styles['Styled-Label']}>About App</label>
            </div>
        </div>
        <div className = {Styles['Mid-Div']} style={{marginBottom:'2rem'}}>
          <div className = {Styles['Heading-Div']}>
            <EnventoryLogo />
            <label className = {Styles['Styled-Label']}>A Smart inventory management system</label>
          </div> 
          <div className = {Styles['DropDown-Div']}>
            <div className = {Styles['DDHeading-Div']}>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#3c26217b' , padding:'0.5rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Bussiness Overview</label>
                <button onClick={() => {SetBODropDown(State => State == true ? false : true)}} style={{ transform: BODropDown ? 'rotate(0) ' : 'rotate(180deg)', transition: 'transform 0.3s ease ' }} className= {Styles['Action-Button']}><IoIosArrowDown size={'1rem'} color='#adbdd5ff'/></button>
            </div>
            <div className={Styles['DDContent-Div']} style={{gridTemplateRows: BODropDown == true ? '1fr' : '0fr'}}>
              <div>
                <label>
                  This app helps for business people to maintain their inventory smartly by maintaing their inventory data , Maintaing supplier information, Simulating LeadTimeDemand using EWMA method and placing orders automatically, Managing employee informations, Placing orders to suppliers via Email, and view organization inventory in Graphs.
              </label>
              </div>
            </div>                       
          </div>

          <div className = {Styles['DropDown-Div']}>
            <div className = {Styles['DDHeading-Div']}>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#3c26217b' , padding:'0.5rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Features Overview</label>
                <button onClick={() => {SetFeatureDD(State => State == true ? false : true)}} style={{ transform: FeatureDD ? 'rotate(0) ' : 'rotate(180deg)', transition: 'transform 0.3s ease ' }} className= {Styles['Action-Button']}><IoIosArrowDown size={'1rem'} color='#adbdd5ff'/></button>
            </div>
            <div className={Styles['DDContent-Div']} style={{gridTemplateRows: FeatureDD == true ? '1fr' : '0fr'}}>
              <div>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#0c3d3c7b' , padding:'0.5rem' , borderRadius:'10px' , marginBottom:'1rem'}}>{`-> Dashboard`}</label>
                <label>
                  <br />
                  <br />
                  The Dashboard will show you the realtime organization data in graphs for easy interpretation.
                  <br />
                  <br />
                  It contains PNL ratio , Daily stock movements, Best selling products, Vendor Data.
              </label>
              <br />
              <br />
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#0c3d3c7b' , padding:'0.5rem' , borderRadius:'10px' , marginBottom:'1rem'}}>{`-> Organization`}</label>
                <label>
                  <br />
                  <br />
                  A single business model is defined a organization and this app contains multiple organizations and every organization's data is secured and can only viewed by their organization users.
                  <br />
                  <br />
                  An organization will be moved to next bussiness day at given time (Closing Time) automatically by app or you can be manually closed by org admins.
                  <br />
                  <br />
                  Lead Time Demand (Minimum stock required to cover upcoming demand untill supplier delivery time) is calculated using Exponentially Weighted Moving Average (EWMA) and orders are placed to Suppliers based on computation, This prevents stock outage.
                  <br />
                  <br />
                  Roles:
                  <br />
                  <br />
                  Admin: Creator who has all action previleges for his/her organization. 
                  <br />
                  Manager: Has previlege to View, Alter Inventory, Add checkout(Billing) , Place order. 
                  <br />
                  Staff (Role) can view Inventory and add checkout(Billing).
              </label>
              <br />
              <br />
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#0c3d3c7b' , padding:'0.5rem' , borderRadius:'10px' , marginBottom:'1rem'}}>{`-> Inventory`}</label>
              <br />
              <br />
              <label>
                  Products: Your org inventory can be managed here, Add Product assign a supplier to the product, add image to product, Fill out other details of the product. 
                  <br />
                  <br />
                  Category: All produts are grouped into categories for easy management.

              </label>
              <br />
              <br />
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#0c3d3c7b' , padding:'0.5rem' , borderRadius:'10px' , marginBottom:'1rem'}}>{`-> Orders`}</label>
              <br />
              <br />
              <label>
                  Place an order to supplier with required products, the order details will be mailed to supplier via Email and open orders and order history can be viewed in the page.
              </label>
              <br />
              <br />
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#0c3d3c7b' , padding:'0.5rem' , borderRadius:'10px' , marginBottom:'1rem'}}>{`-> Users`}</label>
              <br />
              <br />
              <label>
                  Manage your organization users here, Invite new users by clicking on Invite button found in [Organization -- (+)  Button -- Invite]: Enter the Email of people you wish to invite, A 6 Digit unique code will be shared to them via Email, they can enter them in join org page.
              </label>
              <br />
              <br />
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#0c3d3c7b' , padding:'0.5rem' , borderRadius:'10px' , marginBottom:'1rem'}}>{`-> Vendors`}</label>
              <br />
              <br />
              <label>
                  Manage your organization Suppliers in this page. View Lead time (Average Time taken to deliver products), Add new vendor and so on.
              </label>
              <br />
              <br />
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#0c3d3c7b' , padding:'0.5rem' , borderRadius:'10px' , marginBottom:'1rem'}}>{`-> Check Out`}</label>
              <br />
              <br />
              <label>
                  Add a checkout(Billing) in this page.
              </label>
              <br />
              <br />
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#0c3d3c7b' , padding:'0.5rem' , borderRadius:'10px' , marginBottom:'1rem'}}>{`-> Profile`}</label>
              <br />
              <br />
              <label>
                  Alter you'r profile image, Change password, Change organzization in this page.
              </label>
              </div>
            </div>                       
          </div>   

          <div className = {Styles['DropDown-Div']}>
            <div className = {Styles['DDHeading-Div']}>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#3c26217b' , padding:'0.5rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Technical Overview</label>
                <button onClick={() => {SetTechDD(State => State == true ? false : true)}} style={{ transform: TechDD ? 'rotate(0) ' : 'rotate(180deg)', transition: 'transform 0.3s ease ' }} className= {Styles['Action-Button']}><IoIosArrowDown size={'1rem'} color='#adbdd5ff'/></button>
            </div>
            <div className={Styles['DDContent-Div']} style={{gridTemplateRows: TechDD == true ? '1fr' : '0fr'}}>
              <div>
                <div style={{ 
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.4rem" ,
                fontSize:'1.2rem' , fontFamily:'poppins' , backgroundColor:'#4d4d4d24' , padding:'0.5rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'
              }}>Tech_Stack: 
                <span>React JS <FaReact color='rgba(43, 150, 145, 0.67)'/></span>
                <span>, Node JS <FaNodeJs color='rgba(61, 161, 18, 0.73)'/></span>
                <span>, Express JS <SiExpress enableBackground={'rgba(0, 0, 0, 0.73)'} color='rgba(255, 255, 255, 0.73)'/></span>
                <span>, Sequelize ORM <SiSequelize color='rgba(73, 153, 196, 1)'/></span>
                <span>, D3 <FcAreaChart color='rgba(73, 153, 196, 1)'/></span>
                <span>, Apache Kafka <SiApachekafka color='rgba(0, 0, 0, 1)'/></span>
                <span>, Node Mailer <FaMailBulk color='rgba(148, 76, 0, 0.73)'/></span>
                <span>, Zustand <SiFoodpanda /></span>
                <span>, Socket I.O <TbBrandSocketIo /></span>
                <span>, JWT <GiToken color='rgba(97, 71, 12, 0.49)'/></span>
                <span>, Cloudinary <FaCloudDownloadAlt color='rgba(124, 13, 13, 0.8)'/></span>
              </div>
              <br />
              <br />
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#ffffffb4' , padding:'0.2rem' , borderRadius:'10px' ,color:'black', marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Architecture </label>
              <img className = {Styles['Architecture-Image']} src= {Architecture} alt='Architecture IMG load failed ' />
              <br />
              <label>
                Core Architecture: Microservice loosely coupled architecture.
                <br />
                <br />
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#ffffffb4' , padding:'0.2rem' , borderRadius:'10px' ,color:'black', marginRight:'0.2rem' , marginLeft:'0.2rem'}}>FrontEnd</label>
                <br />
                <br />
                The client side Components are made using <span>React JS <FaReact color='rgba(43, 150, 145, 0.67)'/></span> and vanilla CSS(No imported Components), Backend APIs are called by AXIOS. Bar and Line Graphs are made using<span> D3 <FcAreaChart color='rgba(73, 153, 196, 1)'/></span>. Global States such as Inventory, Organization Details , Auth States are maintained using  <span>, Zustand <SiFoodpanda color='rgba(16, 210, 142, 0.73)'/></span>.
              </label>
              <br />
              <br />
              <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#ffffffb4' , padding:'0.2rem' , borderRadius:'10px' ,color:'black', marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Backend </label>
              <br />
              <br />
              <label>
                Backend is powered by <span>, Node JS <FaNodeJs color='rgba(61, 161, 18, 0.73)'/></span>. The APIs are handled by<span> Express JS <SiExpress enableBackground={'rgba(0, 0, 0, 0.73)'} color='rgba(255, 255, 255, 0.73)'/></span>. Backend is written in Server -- Router -- Controller principles. The two services are loosely coupled and communicate via <span>Apache Kafka <SiApachekafka color='rgba(208, 202, 202, 1)'/></span>. 
                <br />
                <br />
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#ffffffb4' , padding:'0.2rem' , borderRadius:'10px' ,color:'black', marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Inventory Service</label>
                Handles rest APIs ,Authentication via <span> JWT <GiToken color='rgba(97, 71, 12, 0.49)'/></span>,Broadcasting real time inventory updates via Socket protocol to organization rooms , Simulation and other business logics are computed in Inventory service.
                <br />
                <br />
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#ffffffb4' , padding:'0.2rem' , borderRadius:'10px' ,color:'black', marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Notification Service</label>
              </label>This service handles Email authentications, OTPs, and forwarding Order details to suppliers.
              <br />
              <label>
                This is the high level architecture and overview of this project. 
                <br />
                Dont want to bore you with more details :')
              </label>
              <br />

              </div>
              
                            
            </div>                       
          </div>
          <div className = {Styles['DropDown-Div']}>
            <div className = {Styles['DDHeading-Div']}>
                <label style={{display:'flex' , flexDirection:'row' , alignItems:'center',gap:'0.25rem' ,  fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#3c26217b' , padding:'0.5rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>About Me <FaSmileWink  color='yellow'/></label>
                <button onClick={() => {SetAboutDD(State => State == true ? false : true)}} style={{ transform: AboutDD ? 'rotate(0) ' : 'rotate(180deg)', transition: 'transform 0.3s ease ' }} className= {Styles['Action-Button']}><IoIosArrowDown size={'1rem'} color='#adbdd5ff'/></button>
            </div>
            <div className={Styles['DDContent-Div']} style={{gridTemplateRows: AboutDD == true ? '1fr' : '0fr'}}>
              <div>
                <label>
                  An Chill developer who loves to build New business ideas to code. Currently working as a .Net Developer from 9 to 5 and grinding as a JavaScript fullstack programmer from 6 to 12. Looking forward to get into new tech world which will assist me to grow and grind all time :) 
                </label>
                <br />
                <br />
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#9c9c9c7b' , padding:'0.5rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Contact Me</label>
                <br />
                <br />
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#1b8b8b7b' , padding:'0.5rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Linked-IN</label><label>: <a href="https://www.linkedin.com/in/madhan-kumar-534200237/" target="_blank" rel="noopener noreferrer">
                LinkedIN URL (click me)
              </a></label>
              </div>
              
              
            </div>
        </div>
      </div>
    </div>
  )
}

export default InfoPage