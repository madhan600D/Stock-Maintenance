import React, { useState } from 'react'
import Styles from './DialButton.module.css'

//Components
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

//Logos
import { IoMdAdd } from "react-icons/io";
function DialButton({ButtonMap = [] , DialButtonColor , FloatDirection}) {
    //Have a button Array of JSON where {Logo is mapped to callback}

    const [Collapse , SetCollapse] = useState(true);
    return (
        <div className={Styles['Button-Div']}>
            <IconButton className = {Styles['Icon-Button']} style={{backgroundColor:DialButtonColor || 'grey'}} onClick={() => {SetCollapse(false)}}>
                
                <div className = {Styles['Map-Div']}>
                    <IoMdAdd 
                        color="white" 
                        className = {Styles['X-Logo']}
                    />
                </div>
            </IconButton>
        </div>
    )
    }

export default DialButton