import React from 'react'
import Styles from './InviteToOrgPage.module.css'
import ItemAdder from '../../Components/ItemAdder/ItemAdder.jsx'

//Stores
import useOrg from '../../../Stores/OrgStore.js'
import ShowToast from '../../Components/Toast/Toast.js'

//Logos
import { CiStreamOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";

function InviteToOrgPage() {
  //Stores
  const {GroupInviteToOrg , IsBulkMailLoading} = useOrg()
  const HandleInviteToOrg = async (GroupOfUsers) => {
    try {
       const res = GroupInviteToOrg(GroupOfUsers)
       ShowToast(res.success , res.message);
    } catch (error) {
      ShowToast(false , error.message)
    }
  }
  return (
    <div className = {Styles['Main-Div']}>
              <div className = {Styles['Top-Div']}>
                         {/* About this page details */}
                         <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                             <CiStreamOn />
                             <label className={Styles['Styled-Label']}>Send Invitation</label>
                         </div>
              </div>
            <div className = {Styles['PageDesc-Div']}>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Send invitation via Email to join our org by adding Mails in</label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#484747ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                                Invite 
                        </label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>
                            input. Send mail by pressing
                        </label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#b3610bff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Push Mail</label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>button.</label>
            </div>
            <ItemAdder 
                ButtonText={"Push Mail"}
                ItemLimit={5}
                ButtonCallBack={HandleInviteToOrg}
            />
    </div>
  )
}

export default InviteToOrgPage