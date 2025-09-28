import React, { use, useRef, useState } from 'react'
import Styles from './ItemAdder.module.css'
//Icons
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaMailBulk } from "react-icons/fa";
import { BsFillSendArrowUpFill } from "react-icons/bs";

//Components
import TextBoxWithLogo from '../TextBoxWithLogo/TextBoxWithLogo';
import ShowToast from '../Toast/Toast.js'
import { useEffect } from 'react';
import TextBoxWithButton from '../TextBoxWithButton/TextBoxWithButton.jsx';
import ButtonWithToolTip from '../ButtonWithToolTip/ButtonWithToolTip.jsx'
function ItemAdder({ButtonText , ItemLimit , Description , ButtonCallBack}) {
    //Variables
    const MailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //Hooks
    const [ItemList , SetItemList] = useState([{ItemData:''}])
    const BulkMailRef = useRef();
    const ButtonRef = useRef();

    //UseEffect to clear the Ip Box when the Item List updates
    useEffect((() => {
        BulkMailRef.current.value = ""
    }) , [ItemList])
    const HandleItemAddClick = async () => {
        if(BulkMailRef?.current.value){
            MailValidate()
            // //Clear the input box
            // BulkMailRef.current.value = ""
        }
        else{
            ShowToast()
        }
        
    }
    const HandleEnterKey = async (e) => {
        console.log("Enter event triggered")
        if(e.key === "Enter"){
            ButtonRef.current.click()
        }
    }
    const MailValidate = async () => {
        if(!BulkMailRef.current.value){
            return
        }
        //Item Limit
        if(ItemList.length > ItemLimit){
            ShowToast(false , `Can add only ${ItemLimit} items ...!`)
            return
        }
        //Duplicate Item
        const duplicate = ItemList.find((item) => item.ItemData === BulkMailRef.current.value);

        if (duplicate) {
            ShowToast(false, "Item already exists!");
            return;
        }
        if(!await MailRegex.test(BulkMailRef.current.value)){
            console.log("Error")
            ShowToast(false , "Invalid Mail ...!")
            BulkMailRef.current.value = ""
            return 
        }
        else{
            SetItemList((prev) => [
            ...prev,
            { ItemData: BulkMailRef.current.value }
            ]);
            
    }    
}
    const HandleMainCallBack = async () => {
        try {
            ButtonCallBack(ItemList)
        } catch (error) {
            
        }
    }
  return (
    <div className = {Styles['Main-Div']}>
        <label>{Description}</label>
        <br />
        <div className = {Styles['ItemDisplay-Div']}>
            {ItemList.map((Item, Index) => {
                if(!Item.ItemData == ''){
                    return (
                    <ItemView key={Index} Data={Item.ItemData} />
                    );
                }
            })}

        </div>
        <div className ={Styles['Input-Div']}>
            <div className ={Styles['InputBox-Div']}>
                <TextBoxWithButton
                    ButtonLogo={IoIosAddCircleOutline}
                    ButtonCallBack={HandleItemAddClick}
                    className = {Styles['Input-TextBox']}
                    Logo={FaMailBulk}
                    IsMandatory={false}
                    EnterCallBack={HandleEnterKey}
                    FloatingText={"Invite To Org"}
                    Type={"STRING"}
                    TBCallBack={() => {}}
                    Reference={BulkMailRef}
                    IsLoading={false}
                    ColorPallete={["rgba(40, 185, 198, 0.66)" , "rgba(2, 69, 75, 0.66)"]}
                />
            </div>
            
            {/* <button ref={ButtonRef} className = {Styles['Submit-Btn']} onClick={() => {HandleItemAddClick()}}>
                <BsFillSendArrowUpFill className = {Styles['Add-Svg']} />
            </button> */}

            <ButtonWithToolTip
                Reference={ButtonRef}
                ButtonLogo={BsFillSendArrowUpFill}
                ButtonCallBack={HandleMainCallBack}
                ToolTipText={ButtonText}
                ColorPalatte={["rgba(255, 255, 255, 0.66)" , "rgba(255, 255, 255, 0.66)" , "rgba(1, 113, 147, 0.66)"]}
            />

        </div>
        
    </div>
  )
}

function ItemView({Data}) {

    return(
    <>
        <div className = {Styles['Item-Div']}>
            <label className = {Styles['Item-Lbl']}>{Data !=="" ? Data : ID}</label>
        </div>
    </>
    )
}

export default ItemAdder