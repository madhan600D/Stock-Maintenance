import React, { useEffect, useState , useRef ,useReducer } from 'react'
import styles from './ProductCard.module.css'

//Components
import ActionButton from '../ActionButton/ActionButton.jsx';
import Tooltip from '@mui/material/Tooltip';
import { BiSolidFileImage } from "react-icons/bi";

//Logos
import { FaRegEdit } from "react-icons/fa";
import DefaultImage from '../../../assets/ProductPage/ProductDefaultImage.jpeg'

//GlobalStates
import UseProduct from '../../../Stores/ProductStore.js';
import { ToastContainer } from 'react-toastify';
import ShowToast from '../Toast/Toast.js';

function ProductCard({ProductID , ProductName , ProductPrice , ActualPrice , VendorName ,ReorderThreshold , Quantity , ProductImage , Unit ,Dimensions}) {
  //States
  const [showEditCard , setShowEditCard]= useState("hide");
  //Local State
  const [animate , setAnimate] = useState({main:'rotate3d(0,1,0, 0deg)',edit:'rotate3d(0,1,0, 90deg)'});

  const {AlterProduct} = UseProduct()

  const ProductImageEditRef = useRef()
  
  //Initialize effect
  const UpdateKeyValue = useRef(new Map());
  useEffect(() => {
    if (showEditCard === "show") {
        setAnimate({ main: 'rotate3d(0, 1, 0, 180deg)' });
        setAnimate({ edit: 'rotate3d(0, 1, 0, 180deg)' });
    }
  }, [showEditCard]);
  
  //Reducer action
  const CardActions = Object.freeze({
    SET_PRODUCT_NAME:"SET_PRODUCT_NAME",
    SET_PRODUCT_PRICE:"SET_PRODUCT_PRICE",
    SET_QUANTITY:"SET_QUANTITY",
    SET_PRODUCT_IMAGE:"SET_PRODUCT_IMAGE",
    RESET_STATE:"RESET_STATE"
  })

  const CardInitialState = {
    ProductName: ProductName ?? "Sample",
    ProductPrice: ProductPrice ?? 0,
    VendorName: VendorName ?? "Unknown Vendor",
    Quantity: Quantity ?? 0,
    ProductImage: ProductImage,
};
  
  function CardReducer(state , action){
    switch(action.type){
      case CardActions.SET_PRODUCT_NAME:
        UpdateKeyValue.current.set("ProductName" , action.payload);
        return {...state , ProductName:action.payload}
      case CardActions.SET_PRODUCT_PRICE:
        UpdateKeyValue.current.set("ProductPrice" , action.payload);
        return {...state , ProductPrice:action.payload}
      case CardActions.SET_PRODUCT_IMAGE:
        UpdateKeyValue.current.set("ProductImage" , action.payload);
        return {...state , ProductImage:action.payload}
      case CardActions.SET_QUANTITY:
        UpdateKeyValue.current.set("Quantity" , action.payload);
        return {...state , Quantity:action.payload}
      case CardActions.RESET_STATE:
        UpdateKeyValue.current.clear();
        return CardInitialState
      default:
        return state
    }

  }

  const [CardState , Dispatch] = useReducer(CardReducer , CardInitialState);
  
  // const [EditCardState , EditDispatch] = useReducer(EditCardReducer , {ProductName:CardState.ProductName , ProductPrice:CardState.ProductPrice , Quantity:Quantity});
  const HandleEditButtonClick = () => {
    try {
      setShowEditCard("show");
      
    } catch (error) {
      throw error
    }
    finally{
    
    }

  }
  const handleUpdateButtonClick = async () => {
    try {
      console.log(UpdateKeyValue)
      const IsAltered = await AlterProduct({UpdateKeyValue:UpdateKeyValue.current , ProductID:ProductID});
      ShowToast(IsAltered.success , IsAltered.message);

    } catch (error) {
    }
    finally{
      setShowEditCard("hide");
    }
  }

  const handleCancelButtonClick = () => {
    setShowEditCard("hide");
    Dispatch({type:CardActions.RESET_STATE})
  }
  const HandleImageUpload = (e) => {
      const File = e.target.files[0];
      const Reader = new FileReader();
      
      Reader.onload = async () => {
        const Base64ofFile = Reader.result;
        
        Dispatch({type:CardActions.SET_PRODUCT_IMAGE , payload:Base64ofFile})
      };

      Reader.readAsDataURL(File); 
    };
  if(showEditCard === "show"){

    return(
    <>
      <div className = {styles['productCardEdit-Div']} style={{transform:animate.edit , width:Dimensions[0] ?? '3rem' , height:Dimensions[1] ?? '5rem'}}>
        {/* need to review */}
        <div className={styles['ImageEdit-Div']}>
            <img className= {styles['Product-Image']} src = {CardState.ProductImage || DefaultImage} alt='Image Not Found..!' />
        <Tooltip title = 'Change Image'>
          <BiSolidFileImage type='file' onClick={() => {ProductImageEditRef.current.click()}} className= {styles['ImageUpload-Button']}/>
        </Tooltip>
        <input type='file' accept='image/*'  onChange={() => HandleImageUpload(event)} style={{display:'none'}} ref={ProductImageEditRef} />
        </div>
        
        <div  className = {styles['productCardEditInput-Div']} >
          <div style={{display:'flex' , flexDirection:'row' , fontSize:'xx-small' , alignItems:'center' , gap:'0.5rem'}}>
              <label style={{margin:0}}>Name: </label>
              <input  value = {CardState.ProductName}  type='text' className = {styles['productData-Input']} placeholder='Product Name' onChange={(e) => {Dispatch({type:CardActions.SET_PRODUCT_NAME , payload:e.target.value})}}/>
          </div>
          <div style={{display:'flex' , flexDirection:'row' , fontSize:'xx-small' , alignItems:'center',gap:'0.5rem'}}>
              <label style={{margin:0}}>Price  :</label>
         <input  value = {CardState.ProductPrice}  type='number' className = {styles['productData-Input']} placeholder='Product Price' onChange={(e) => {Dispatch({type:CardActions.SET_PRODUCT_PRICE , payload:e.target.value})}}/>
         </div>
         <div style={{display:'flex' , flexDirection:'row' , fontSize:'xx-small' , alignItems:'center',gap:'0.5rem'}}>
          <label style={{margin:0}}>Quantity: </label>
         <input  value = {CardState.Quantity}  type='number' className = {styles['productData-Input']} placeholder='Quantity' onChange={(e) => {Dispatch({type:CardActions.SET_QUANTITY , payload:e.target.value})}}/>
         </div>
        </div>
        
        <div className= {styles['ProductCardButtonsEdit-Div']}>
          <button className= {styles['update-Button']} onClick={handleUpdateButtonClick}>Update</button>
          <button className= {styles['cancel-Button']} onClick={handleCancelButtonClick}>Cancel</button>
        </div>
        
      </div>
      <ToastContainer />
    </>
    );
  }
  else {
    return (
      <>
      <div className={styles['productCard-Div']} style={{transform:animate.main , width:Dimensions[0] ?? '3rem' , height:Dimensions[1] ?? '5rem'}}>
          <img className= {styles['Product-Image']} src = {ProductImage || DefaultImage} alt='Image Not Found..!' />
          <div className= {styles['ProductCardDescription-Div']}>
            <div className = {styles['ProductDesc-Div']}>
                <p className= {styles['ProductName-Label']}>{ProductName}</p>
              <p className= {styles['ProductPrice-Label']}>$ {ProductPrice}</p>
            </div>
              <div className = {styles['ProductSubDesc-Div']}>
                  <p className= {styles['Desc-Label']}>ProductVendor: {VendorName}</p>
                  <p className= {styles['Desc-Label']}>Available: {`${Quantity} ${Unit}`}</p>
                  <p className= {styles['Desc-Label']}>Threshold: {`${ReorderThreshold ?? 'NA'}`}</p>
                  <p className= {styles['Desc-Label']}>ActualPrice: {`${ActualPrice ?? 'NA'}`}</p>
                  <p className= {styles['Desc-Label']}>ReOrderLevel: {`${ReorderThreshold ?? 'NA'}`}</p>
              </div>
              
          <div className= {styles['ProductCardButtons-Div']}>
                <ActionButton 
                  className= {styles['Action-Button']}
                  ButtonColor={'#7c7b7bdc'}
                  Logo={FaRegEdit}
                  ToolTipText={'Edit'}
                  Callback={() => HandleEditButtonClick()}
                />
              </div>
          </div>
      </div>
      </>
      
      
    )
  }
  
}

export default ProductCard;