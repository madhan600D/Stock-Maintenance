import React , {useState , useReducer , useRef , useEffect} from 'react'
import Styles from './OrderPage.module.css'

import { StateToTable } from '../../../Utils/QueryToObject.js';
//Stores
import useProduct from '../../../Stores/ProductStore.js';

//Components
import ActionButton from '../../Components/ActionButton/ActionButton.jsx';
import FormComponent from '../../Components/FormComponent/FormComponent.jsx'
import SearchBox from '../../Components/SearchBox/SearchBox.jsx'
import NumberInput from '../../Components/NumberInput/NumberInput.jsx';
import Tooltip from '@mui/material/Tooltip';
import ShowToast from '../../Components/Toast/Toast.js'
import PageSelector from '../../Components/PageSelector/PageSelector.jsx';
import Table from '../../Components/Table/Table.jsx';

//Icons
import { FaShoppingCart } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { VscClearAll } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";
import { LiaCartArrowDownSolid } from "react-icons/lia";
import { FaCartPlus } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { FaClipboardCheck } from "react-icons/fa6";
import { PiListDashesFill } from "react-icons/pi";
import { ToastContainer } from 'react-toastify';
import LabelWithLogo from '../../Components/LabelWithLogo/LabelWithLogo.jsx';

function OrderPage() {
    //States
    const [Order , SetOrder] = useState({ProductID:"" , ProductName:"" , Quantity:0 , Price:0});
    //Login --> OrderDashboard , SignUp --> Add Order
    const [CurrentView , SetCurrentView] = useState("Login");
    const [TotalCost , SetTotalCost] = useState(0);
    const [ShowAddOrder , SetShowAddOrder] = useState(false);
    const [CurrentOrdersTable , SetCurrentOrdersTable] = useState();
    const [HistoryOrdersTable , SetHistoryOrdersTable] = useState();
    const {Products , AddOrder ,  OrderHistory , ConfirmOrder} = useProduct()
    const CurrentOrders = useProduct(state => state.CurrentOrders)

    
    const FormRef = useRef()
    
    const OrderActions = Object.freeze({
        ADD_ORDER:"ADD_ORDER",
        REMOVE_ORDER:"REMOVE_ORDER",
        CLEAR_ORDER:"CLEAR_ORDER"
    })
    const OrderReducer = (State , Action) => {
        switch(Action.Type){
            case OrderActions.ADD_ORDER:
                //Get Product Data from global state
                const GlobalProductIndex = Products[0].findIndex(Product => Product.ProductName == Action.Payload.ProductName);
                
                
                //Duplicate validation: Add quantity on top of previous
                let ProductIndex = -1;
                for (let Index = 0; Index < State?.length; Index += 1) {
                        if (State[Index].ProductName === Action.Payload.ProductName) {
                            ProductIndex = Index;
                            break;
                        }
                    }
                if(ProductIndex !== -1){
                    //The Product already exsists so add the new count to it
                    let CurrentState = [...State];

                    //Compute quantity and recompute price
                    const NewAddedProductPrice = Products[0][GlobalProductIndex].ActualPrice * Action.Payload.Quantity
                    const NewPriceValue = (CurrentState[ProductIndex].Quantity + Action.Payload.Quantity) * Products[0][GlobalProductIndex].ActualPrice
                    CurrentState[ProductIndex] = {...CurrentState[ProductIndex] , Quantity: CurrentState[ProductIndex].Quantity + Action.Payload.Quantity , Price:NewPriceValue}
                    SetTotalCost(CostState => CostState + NewAddedProductPrice)
                    return CurrentState
                }
                if(Action.Payload.Quantity < 1){
                    ShowToast(false , "Set Some quantity")                    
                    return State;
                }
                //Compute Price
                const NewPrice = Action.Payload.Quantity * Products[0][GlobalProductIndex].ActualPrice;
                SetTotalCost(CostState => CostState + NewPrice);
                return [...State , {...Action.Payload , Price:NewPrice}]
            case OrderActions.REMOVE_ORDER:
                let DeducePrice = State[State.findIndex(OldCheck => OldCheck.ProductName == Action.Payload)].Price
                SetTotalCost(CostState => CostState - DeducePrice);
                return State.filter(Prod => Prod.ProductName !== Action.Payload);
            case OrderActions.CLEAR_ORDER:
                SetTotalCost(0);
                return OrderInitialState;
        }

    }
    const OrderInitialState = [{ProductID:'' , ProductName:'' , Quantity:'' , Price:''}];
    //Functions
    async function ProceedToPlaceOrder(Data) {
        if(Data?.ProductItems?.length < 1){
            ShowToast(false , "Please add one or more products to proceed.")
        }
        const IsSuccess = await AddOrder({TotalItems:OrderState?.length - 1 , ProductItems:OrderState , TotalCost:TotalCost});
        ShowToast(IsSuccess.success , IsSuccess.message);
        Dispatch({type:OrderActions.CLEAR_ORDER});
    }

    async function ProceedToConfirmOrder(Data) {
        const IsSuccess = await ConfirmOrder(Data);
        ShowToast(IsSuccess.success , IsSuccess.message);
    }
    //Events
    useEffect(() => {
        const HandleClick = (Event) => {
            if(FormRef.current && !FormRef.current.contains(Event.target)){
                FormRef.current.value = ""
                SetShowAddOrder(false);
            }
        }
        document.addEventListener("mousedown" , HandleClick);
        return () => document.removeEventListener("mousedown", HandleClick);
    } , [])
    //Current Orders table constructor
    useEffect(() => {
        let table =  StateToTable(CurrentOrders, {} , ['OrderID' , 'VendorName' , 'OrderData']); 
        if(table){
            table = {...table,Columns: [...table.Columns,{ ColumnName: "Confirm Order", IsEditable: false }]};
            for(let Index = 0 ; Index <= table.Rows.length - 1 ; Index += 1){
                table.Rows[Index].push(<ActionButton ButtonColor={'#4A90E2'} Logo={FaClipboardCheck} Callback={() => {ProceedToConfirmOrder(table.Rows[Index][0])}} ToolTipText={"Confirm"}/>)
            }
        }
        
        SetCurrentOrdersTable(table)
        
    } , [CurrentOrders]);
    //Order history table constructor
    useEffect(() => {
        let HistoryTable =  StateToTable(OrderHistory, {} , ['OrderHistoryID' , 'VendorName' , 'OrderData' , 'DaysToDeliver' , 'OrderConfirmDate']); 
        
        SetHistoryOrdersTable(HistoryTable)
        
    } , [OrderHistory])
    const [OrderState , Dispatch] = useReducer(OrderReducer , OrderInitialState);
    const AddOrderLayout = {"Add New Order" : [
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
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>to add a ORDER. </label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}> Click anywhere to</label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#c3380dff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>CLOSE</label>
                        <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>the form.</label>
                            
                    </div>
            ,
                    <SearchBox 
                        Data={Products[0].map(Product => Product.ProductName)}
                        Logo={IoCartOutline}
                        SelectionCallBack={(Value) => SetOrder(Prev => ({...Prev , ProductName:Value}))}
                        PlaceHolder='Products'
                        DataType={"STRING"}
                        FilterType={"SubString"}
                        MaxItems={10}
                        ColorPallete={["#ff3b14cc" , "rgba(129, 129, 129, 0.8)"]}
                    /> , 
                    <NumberInput 
                        label='Quantity'
                        value={Order.Quantity}
                        min={1}
                        step={1}
                        onChange={(Value) => SetOrder(Prev => ({...Prev , Quantity:Value}))}
                    />
                ] ,
                GridSpan:1
            }
        }
    ]}
  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['PageSelect-Div']}>
            <PageSelector 
                PageHeader={[<div className = {Styles['PageTab-Div']}><PiListDashesFill size={28} color="#4A90E2" /><label style={{fontSize:'0.8rem' ,fontFamily:'poppins'}}>Order Dashboard</label></div>  , <div className = {Styles['PageTab-Div']}><FaCartPlus size={28} color="#4A90E2" /><label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>AddOrder</label></div>]}
                CurrentPage={CurrentView}
                SetCurrentPage={SetCurrentView}
                Dimension={['40rem' , 'auto']}
            />
        </div>
        <div className={Styles['Form-Div']}  style={{transform: ShowAddOrder ? "translate(25%, 10%)" : "translate(25%, -110%)"}}>
            <FormComponent
                Reference={FormRef}
                Structure={AddOrderLayout}
                ReducerState={OrderState}
                LoadingState={false}
                SubmitCallback={() => {
                    Dispatch({Type:OrderActions.ADD_ORDER , Payload:Order})
                    SetShowAddOrder(false)
                }}

            />
        </div>
        {CurrentView && CurrentView === "SignUp" ? (
            <div className={Styles['AddOrder-Div']}>
                <div className = {Styles['Top-Div']}>
            {/* About this page details */}
            <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                <FaShoppingCart />
                <label className={Styles['Styled-Label']}>Orders</label>
            </div>
            <div className = {Styles['PageDesc-Div']}>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Place order to vendors to replenish inventoty, Click on:</label>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e4870ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                        Add Order 
                </label>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>
                    to add a product and click: 
                </label>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e7032ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Place Order</label>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>button to place a order via Email to vendor.</label>
            </div>
            </div>
            <div className = {Styles['Action-Div']}>
            {/* Product add Button , clear button */}
                    
            <button onClick={() => SetShowAddOrder(true)} className= {Styles['Action-Button']}><FaCartPlus size={'1rem'} color='#adbdd5ff'/>Add Order</button>
            <button onClick={() => {Dispatch({Type:OrderActions.CLEAR_ORDER})}} className= {Styles['Action-Button']}><VscClearAll size={'1rem'} color='#adbdd5ff'/>Clear all</button>
            <label style={{position:'absolute' , right:'0' , fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#6fb6f471' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>Total Orders: {OrderState?.length - 1}</label>
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
                        {OrderState && OrderState.map(
                            (Order , Index) => (Index !== 0 ?
                                <tr>
                                    <td>{Index}</td>
                                    <td>{Order.ProductName}</td>
                                    <td>{Order.Quantity}</td>
                                    <td>{Order.Price}</td>
                                    <td>
                                        <ActionButton 
                                            ButtonColor={'transparent'}
                                            Logo={MdDeleteOutline}
                                            ToolTipText={'Remove'}
                                            Callback={() => {Dispatch({Type:OrderActions.REMOVE_ORDER , Payload:Order.ProductName})}}
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
                
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Total Order Cost:</label>
                <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e4870ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                    {/*TBD: Remove the / 2 in production: It is Added to eliminate double counting due to strict mode */}
                        {TotalCost ? TotalCost / 2 : 0} 
                </label>
            </div>
            <div className = {Styles['Footer-Div']}>
                <Tooltip title = '' arrow>
                        <button onClick={() => {ProceedToPlaceOrder({TotalItems:OrderState.length , ProductItems:OrderState , TotalCost:TotalCost})}} style={{backgroundColor:'rgba(46, 146, 42, 1)'}} className= {Styles['Action-Button']}><LiaCartArrowDownSolid size={'1rem'} color='#adbdd5ff'/>Place Order</button>
                </Tooltip>
                        
            </div>
        </div>
        ) : (
        <div className= {Styles['OrderDash-Div']}>
            <div className = {Styles['Top-Div']}>
                {/* About this page details */}
                <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , fontSize:'1.6rem' , gap:'0.6rem' , backgroundColor:'#1E232B' , padding:'0.6rem' , borderRadius:'10px'}}>
                    <FaShoppingCart />
                    <label className={Styles['Styled-Label']}>Order Dashboard</label>
                </div>
                <div className = {Styles['PageDesc-Div']}>
                    <label style={{fontSize:'0.8rem' , fontFamily:'poppins'}}>Track running orders and confirm delivered orders by pressing:</label>
                    <label style={{fontSize:'0.8rem' , fontFamily:'poppins' , backgroundColor:'#2e4870ff' , padding:'0.3rem' , borderRadius:'10px' , marginRight:'0.2rem' , marginLeft:'0.2rem'}}>
                            <FaClipboardCheck />.
                    </label>
                </div>
            </div>
            <div className = {Styles['Mid-Div']}>
                <div style={{display:'flex' , gap:'1rem' ,width:'100%' , justifyContent:'space-around' , marginBottom:'2rem'}}>
                    <LabelWithLogo 
                        Header={"Open Orders"}
                        Value={CurrentOrders[0]?.length}
                        Logo={FaBoxOpen}
                        BGColor={'rgba(136, 255, 72, 0.52)'}
                        Dimension={['25rem' , '5rem']}
                    />
                    <LabelWithLogo 
                        Header={"Order History"}
                        Value={OrderHistory[0]?.length}
                        Logo={FaHistory}
                        BGColor={'rgba(148, 49, 0, 0.45)'}
                        Dimension={['25rem' , '5rem']}
                    />
                </div>
                <div className = {Styles['OpenOrders-Div']}>
                    {CurrentOrdersTable && (
                        <Table 
                            TableName={"Current Orders"}
                            TableArg={CurrentOrdersTable}
                            DisplayOptions = {false}
                            Dimensions={["100%" , ""]}
                        />
                    )}
                </div>
                <div className = {Styles['HistoryOrders-Div']}>
                    {HistoryOrdersTable && (
                        <Table 
                            TableName={"Order History"}
                            TableArg={HistoryOrdersTable}
                            DisplayOptions = {true}
                            Dimensions={["100%" , "10rem"]}
                        />
                    )}
                </div>
                

            </div>    
        </div>)}
        
        
        
        <ToastContainer />
    </div>
  )
}

export default OrderPage