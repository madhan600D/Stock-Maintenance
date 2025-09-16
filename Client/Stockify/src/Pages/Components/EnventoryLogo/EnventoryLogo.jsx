import React from 'react'
import Styles from './EnventoryLogo.module.css'

import Image from '../../../assets/Logo/EnventoryLogo.png'

import { FaTools } from "react-icons/fa";
import { PiNotepadFill } from "react-icons/pi";
import { TbCircleLetterEFilled } from "react-icons/tb";
function EnventoryLogo() {
  return (
    <div className={Styles['logo']}>
        <img src={Image} alt="ENventory Logo" />
    </div>
  )
}

export default EnventoryLogo