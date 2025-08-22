import React from 'react'
import Styles from './InviteToOrgPage.module.css'
import ItemAdder from '../Components/ItemAdder/ItemAdder.jsx'
function InviteToOrgPage() {
  return (
    <div className = {Styles['Main-Div']}>
            <ItemAdder 
                ButtonText={"ADD"}
            />
    </div>
  )
}

export default InviteToOrgPage