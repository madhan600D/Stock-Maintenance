import React , {useState , useReducer , useRef , useEffect} from 'react'
import Styles from './CheckoutPage.module.css'

//Stores
import useProduct from '../../../Stores/ProductStore.js';

//Components
import ActionButton from '../../Components/ActionButton/ActionButton.jsx';
import FormComponent from '../../Components/FormComponent/FormComponent.jsx'
import SearchBox from '../../Components/SearchBox/SearchBox.jsx'
import NumberInput from '../../Components/NumberInput/NumberInput.jsx';
import Tooltip from '@mui/material/Tooltip';
import ShowToast from '../../Components/Toast/Toast.js'

//Icons
import { IoMdPaper } from "react-icons/io";
import { VscClearAll } from "react-icons/vsc";
import { IoIosAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { ToastContainer } from 'react-toastify';

function CheckoutPage() {
    //States
    const [Check , SetCheck] = useState({ProductID:"" , ProductName:"" , Quantity:0 , Price:0});
    const [TotalCost , SetTotalCost] = useState(0);
    const [ShowAddCheck , SetShowAddCheck] = useState(false);
    const FormRef = useRef()
    const {Products , AddCheckout} = useProduct()
    const CheckActions = Object.freeze({
        ADD_CHECK:"ADD_CHECK",
        REMOVE_CHECK:"REMOVE_CHECK",
        CLEAR_CHECK:"CLEAR_CHECK"
    })
    const CheckReducer = (State , Action) => {
        switch(Action.Type){
            case CheckActions.ADD_CHECK:
                //Get Product Data from global state
                const GlobalProductIndex = Products[0].findIndex(Product => Product.ProductName == Action.Payload.ProductName);
                
                
                //Duplicate validation: Add quantity on top of previous
                let ProductIndex = -1;
                for (let Index = 0; Index < State.length; Index += 1) {
                        if (State[Index].ProductName === Action.Payload.ProductName) {
                            ProductIndex = Index;
                            break;
                        }
                    }
                if(ProductIndex !== -1){
                    //The Product already exsists so add the new count to it
                    let CurrentState = [...State];
                    //Compute quantity and recompute price
                    const NewAddedProductPrice = Products[0][GlobalProductIndex].ProductPrice * Action.Payload.Quantity
                    const NewPriceValue = (CurrentState[ProductIndex].Quantity + Action.Payload.Quantity) * Products[0][GlobalProductIndex].ProductPrice
                    CurrentState[ProductIndex] = {...CurrentState[ProductIndex] , Quantity: CurrentState[ProductIndex].Quantity + Action.Payload.Quantity , Price:NewPriceValue}
                    SetTotalCost(CostState => CostState + NewAddedProductPrice)
                    return CurrentState
                }
                if(Action.Payload.Quantity < 1){
                    ShowToast(false , "Set Some quantity")                    
                    return State;
                }
                //Compute Price
                const NewPrice = Action.Payload.Quantity * Products[0][GlobalProductIndex].ProductPrice;
                SetTotalCost(CostState => CostState + NewPrice);
                return [...State , {...Action.Payload , Price:NewPrice}]
            case CheckActions.REMOVE_CHECK:
                let DeducePrice = State[State.findIndex(OldCheck => OldCheck.ProductName == Action.Payload)].Price
                SetTotalCost(CostState => CostState - DeducePrice);
                return State.filter(Prod => Prod.ProductName !== Action.Payload);
            case CheckActions.CLEAR_CHECK:
                SetTotalCost(0);
                return  CheckInitialState;
        }

    }
    const CheckInitialState = [{ProductID:'' , ProductName:'' , Quantity:'' , Price:''}];
    //Functions
    async function ProceedToCheckout(Data) {
        if(Data?.length < 1){
            ShowToast(false , "Please add one or more products to proceed.")
        }
        const IsSuccess = await AddCheckout({TotalItems:CheckoutState?.length - 1 , ProductItems:CheckoutState , TotalCost:TotalCost});
        ShowToast(IsSuccess.success , IsSuccess.message);
    }
    //Events
    useEffect(() => {
        const HandleClick = (Event) => {
            if(FormRef.current && !FormRef.current.contains(Event.target)){
                FormRef.current.value = ""
                SetShowAddCheck(false);
            }
        }
        document.addEventListener("mousedown" , HandleClick);
        return () => document.removeEventListener("mousedown", HandleClick);
    } , [])
    const [CheckoutState , Dispatch] = useReducer(CheckReducer , CheckInitialState);
    const AddCheckLayout = {"AddNewCheck" : [
        {
            "":{
                ArrayOfElements:[
                    <div className = {Styles['PageDesc-Div']}>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Search for products in the below box and assign a:</label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e4870ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                                Quantity 
                        </label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>to it and click on:</label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#0d55c3ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                                CONFIRM 
                        </label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>to add a check. </label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}> Click anywhere to</label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#c3380dff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>CLOSE</label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>the form.</label>
                            
                    </div>
            ,
                    <SearchBox 
                        Data={Products[0].map(Product => Product.ProductName)}
                        Logo={IoCartOutline}
                        SelectionCallBack={(Value) => SetCheck(Prev => ({...Prev , ProductName:Value}))}
                        PlaceHolder='Products'
                        DataType={"STRING"}
                        FilterType={"SubString"}
                        MaxItems={10}
                        ColorPallete={["#ef9f3ecc" , "rgba(129, 129, 129, 0.8)"]}
                    /> , 
                    <NumberInput 
                        label='Quantity'
                        value={Check.Quantity}
                        min={1}
                        step={1}
                        onChange={(Value) => SetCheck(Prev => ({...Prev , Quantity:Value}))}
                    />
                ] ,
                GridSpan:1
            }
        }
    ]}
  return (
    <div className = {Styles['Main-Div']}>
        <div className={Styles['Form-Div']}  style={{transform: ShowAddCheck ? "translate(25%, 10%)" : "translate(25%, -110%)"}}>
            <FormComponent
                Reference={FormRef}
                Structure={AddCheckLayout}
                ReducerState={CheckoutState}
                LoadingState={false}
                SubmitCallback={() => {
                    Dispatch({Type:CheckActions.ADD_CHECK , Payload:Check})
                    SetShowAddCheck(false)
                }}

            />
        </div>
        <div className = {Styles['Top-Div']}>
        {/* About this page details */}
        <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
            <IoMdPaper />
            <label className={Styles['Styled-Label']}>Checkouts</label>
        </div>
        <div className = {Styles['PageDesc-Div']}>
            <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Product billing page, Click on:</label>
            <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e4870ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                    Add Check 
            </label>
            <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>
                to add a bill and place a checkout by clicking on: 
            </label>
            <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e7032ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Proceed Checkout</label>
            <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>button.</label>
                
        </div>
        </div>
        <div className = {Styles['Action-Div']}>
        {/* Product add Button , clear button */}
                
        <button onClick={() => SetShowAddCheck(true)} className= {Styles['Action-Button']}><IoIosAdd size={'1rem'} color='#adbdd5ff'/>Add Check</button>
        <button onClick={() => {Dispatch({Type:CheckActions.CLEAR_CHECK})}} className= {Styles['Action-Button']}><VscClearAll size={'1rem'} color='#adbdd5ff'/>Clear all</button>
        <label style={{position:'absolute' , right:'0' , fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#6fb6f471' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Total Checks: {CheckoutState?.length - 1}</label>
        </div>
        <div className = {Styles['Table-Div']}>
            <table
                cellPadding="6"
                cellSpacing="0"
                style={{ borderCollapse: "collapse", width: "100%", fontFamily: "Arial, sans-serif", fontSize: "14px"}}
                className= {Styles['Table']}
                >
                <thead className= {Styles['Table-Head']}>
                    <tr style={{color: "rgba(127, 133, 139, 0.73)" , fontWeight:'bolder' }} >
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody className= {Styles['Table-Body']}>
                    {CheckoutState && CheckoutState.map(
                        (Check , Index) => (Index !== 0 ?
                            <tr>
                                <td>{Index}</td>
                                <td>{Check.ProductName}</td>
                                <td>{Check.Quantity}</td>
                                <td>{Check.Price}</td>
                                <td>
                                    <ActionButton 
                                        ButtonColor={'transparent'}
                                        Logo={MdDeleteOutline}
                                        ToolTipText={'Remove'}
                                        Callback={() => {Dispatch({Type:CheckActions.REMOVE_CHECK , Payload:Check.ProductName})}}
                                    />
                            </td>
                            </tr>
                            : ""
                        )
                    )}
                    
                </tbody>
                </table>
        </div>
        <div className = {Styles['Summary-Div']}>
            
            <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Total Cost:</label>
            <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e4870ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                {/*TBD: Remove the / 2 in production: It is Added to eliminate double counting due to strict mode */}
                    {TotalCost / 2} 
            </label>
        </div>
        <div className = {Styles['Footer-Div']}>
            <Tooltip title = '' arrow>
                    <button onClick={() => {ProceedToCheckout()}} style={{backgroundColor:'rgba(46, 146, 42, 1)'}} className= {Styles['Action-Button']}><TiTick size={'1rem'} color='#adbdd5ff'/>Proceed CheckOut</button>
            </Tooltip>
                    
        </div>
        <ToastContainer />
    </div>
  )
}

export default CheckoutPage