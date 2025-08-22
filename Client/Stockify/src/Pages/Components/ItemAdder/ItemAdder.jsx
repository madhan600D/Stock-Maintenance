import React, { useRef, useState } from 'react'
import Styles from './ItemAdder.module.css'
//Icons
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaMailBulk } from "react-icons/fa";

//Components
import TextBoxWithLogo from '../TextBoxWithLogo/TextBoxWithLogo';
function ItemAdder({ButtonText}) {
    //Hooks
    const [ItemCount , SetItemCount] = useState(0);
    const [ItemList , SetItemList] = useState([{ItemData:"" , ID:""}])
    const BulkMailRef = useRef();
    const HandleItemAddClick = async () => {
        SetItemCount(ItemCount + 1)
        SetItemList((Prev) => ({...Prev , ID:ItemCount + 1}));
    }
  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['ItemDisplay-Div']}>
            {ItemList.map((Item , Index) => <React.Fragment key={Index}>{ItemView(Item.ItemData , Index)}</React.Fragment>)}
        </div>
        <div className ={Styles['Input-Div Div']}>
            <TextBoxWithLogo
            Logo={FaMailBulk}
            IsMandatory={false}
            FloatingText={"Enter 5 Mails To Invite To Org..."}
            Type={"STRING"}
            TBCallBack={() => console.log("TB Pressed")}
            Reference={BulkMailRef}
            IsLoading={false}
            ColorPallete={["red" , "brown"]}
            />
            <button className = {Styles['Submit-Btn']} onClick={() => {HandleItemAddClick()}}><IoIosAddCircleOutline className = {Styles['Add-Svg']} />
        </button>
        </div>
        
    </div>
  )
}

function ItemView({Data , ID}) {

    return(
    <>
        <div className = {Styles['Item-Div']}>
            <label className = {Styles['Item-Lbl']}>{Data !=="" ? Data : ID}</label>
        </div>
    </>
    )
}

export default ItemAdder