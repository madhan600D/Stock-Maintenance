import React, { useState } from 'react'
import Styles from './DialButton.module.css'

//Components
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

//Logos
import { IoMdAdd } from "react-icons/io";
function DialButton({ButtonMap , DialButtonColor , DialButtonLogo , FloatDirection}) {
    const [Collapse , SetCollapse] = useState(true);
    return (
        <div className={Styles['Button-Div']}>
            <Tooltip title="Click To Open" arrow>
                <IconButton className = {Styles['Icon-Button']} style={{backgroundColor:DialButtonColor}} onClick={() => {SetCollapse(false)}}>
                    <IoMdAdd 
                        color="white" 
                        className = {Styles['X-Logo']}
                    />
                </IconButton>
            </Tooltip>
        </div>
    )
    }

export default DialButton