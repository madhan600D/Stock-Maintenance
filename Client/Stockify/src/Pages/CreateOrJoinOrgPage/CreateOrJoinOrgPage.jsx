import React, { useEffect, useState } from 'react'
import Styles from './CreateOrJoinOrgPage.module.css'
import { useNavigate } from 'react-router-dom';
function CreateOrJoinOrgPage() {
  //States
  const [CurrentPage , SetCurrentPage] = useState();
  const navigate = useNavigate();
  //UseEffects
  useEffect(() => {
    if(CurrentPage === 'CreateOrg'){
      navigate('create-org');
    }
    else if(CurrentPage === 'JoinOrg'){
      navigate('join-org');
    }
  } , [CurrentPage])
  return (
    <div className = {Styles['Main-Div']}>
      <div className= {Styles['CreateOrg-Div']} onClick={() => {SetCurrentPage('CreateOrg')}}>
        <label className = {Styles['OrgText-Lbl']}>
          Create Organization
        </label>
      </div>
      <div className= {Styles['JoinOrg-Div']} onClick={() => {SetCurrentPage('JoinOrg')}}>
        <label className = {Styles['OrgText-Lbl']}>
          Join Organization
        </label>
      </div>
    </div>
  )
}

export default CreateOrJoinOrgPage