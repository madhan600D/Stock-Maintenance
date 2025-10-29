import React, { useState } from 'react'
import Styles from './DialButton.module.css'

//Components
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

//Logos
import { IoMdAdd } from "react-icons/io";
function DialButton({ActionArray = [] , DialButtonColor , FloatDirection}) {
    //Have a button Array of JSON where {Logo is mapped to callback}

    const [Collapse , SetCollapse] = useState(true);
    return (
        <div className={Styles['Main-Div']}>
            <div className={Styles['Dial-Div']} style={{backgroundColor:DialButtonColor || "grey"}}>   
                <IoMdAdd 
                    color="white" 
                    className = {Styles['X-Logo']}
                />
            </div>
                
                <div className = {Styles['Map-Div']}>
                    
                    {ActionArray.map((Action) => (
                        <div className= {Styles['Action']}>
                            <Tooltip placement='left' title = {Action.Tooltip || ''} arrow >
                                <button className= {Styles['Action-Button']} onClick={() => Action.Callback()}>
                                    <Action.Logo size={'1rem'} color='#adbdd5ff'/>
                                </button>
                            </Tooltip>
                        </div>
                    ))}
                </div>
        </div>
    )
    }

export default DialButton