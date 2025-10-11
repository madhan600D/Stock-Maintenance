import React from 'react'

import Styles from './ActionButton.module.css'
//Components
import Tooltip from '@mui/material/Tooltip';
function ActionButton({ButtonColor , Logo , ToolTipText , Callback}) {
  return (
    <Tooltip title = {ToolTipText || "Action"}>
        <button onClick={() => {Callback()}} className = {Styles['Action-Button']} style={{backgroundColor:ButtonColor}}>
            <Logo  className= {Styles['Action-Icon']} />
        </button>
    </Tooltip> 
  )
}

export default ActionButton