import React from 'react'
import Styles from './InviteToOrgPage.module.css'
import ItemAdder from '../../Components/ItemAdder/ItemAdder.jsx'

//Stores
import useOrg from '../../../Stores/OrgStore.js'
import ShowToast from '../../Components/Toast/Toast.js'
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
            <ItemAdder 
                ButtonText={"Push Mail"}
                ItemLimit={5}
                ButtonCallBack={HandleInviteToOrg}
            />
    </div>
  )
}

export default InviteToOrgPage