import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';
import useOrg from '../Stores/OrgStore.js'
import { ClientSocketEventsEnum, EventActionsEnum } from '../Declarations/ClientPublicEnums.js';
import useUser from './UserStore.js';

 const UseProduct = create((set , get) => ({
    IsAuthenticated:false,
    
    //Fallback States
    IsProductsLoading:false,

    //Global States
    Category:[],
    Products:[],
    Vendors:[],
    CheckOuts:[],
    Currency:[],
    CurrentOrders:[],
    OrderHistory:[],
    OrganizationAnalytics:[],
    ProductAnalytics:[],
    VendorAnalytics:[],
    HighSellingProducts:[],
    AverageLeadTime:[],
    PNL:{TotalRevenue:0 , TotalExpense:0},
    GetProducts : async(CatID = 0) => {
        try {
            const res = await AxiosInstance.get(`/api/userservice/inv/get_products?CatID=${CatID}`)
            const DataFromBackEnd = res.data?.data
            if(DataFromBackEnd){
                set({Products:[DataFromBackEnd]})
                return {success:true , data:DataFromBackEnd}
            }
        } catch (error) {
            console.log(error.message)
            return {success:false , message:"Error at organization validation ...!"}
            
        }
    },
    GetPerformance:async() => {
        try {
            const res = await AxiosInstance.get('/api/userservice/inv/get_analytics');
            const DataFromBackEnd = res.data?.data;

            //Fill states
            set({
                OrganizationAnalytics:[DataFromBackEnd.OrganizationAnalytics],
                ProductAnalytics:[DataFromBackEnd.ProductAnalytics],
                VendorAnalytics:[DataFromBackEnd.VendorAnalytics],
            })

            return
        } catch (error) {
            console.log(error.message)
            return {success:false , message:"Error at while filling analytics ...!"}
        }
    },
    GetCategory : async(CatID = 0) => {
        try {
            const res = await AxiosInstance.get(`/api/userservice/inv/get_categories`)
            const DataFromBackEnd = res.data?.data
            if(DataFromBackEnd){
                set({Category:[DataFromBackEnd]})
                return {success:true , message:"Categories"}
            }
            else{
                return
            }
        } catch (error) {
            console.log(error.message)
            return {success:false , message:"Error at organization validation ...!"}
            
        }
    },
    GetCheckoutsClient:async() => {
        try {
            const res = await AxiosInstance.get('api/userservice/inv/get_checkouts');
            const DataFromBackEnd = res.data.data;
            if(DataFromBackEnd){
                set({CheckOuts:[DataFromBackEnd]})
                return {success:true}
            }
            else{
                return
            }
        } catch (error) {
            console.log(error.message)
            return {success:false , message:"Error at Vendor get ...!"}
        }
    },
    GetVendors:async() => {
        try {
            const res = await AxiosInstance.get('api/userservice/inv/get_vendor');
            const DataFromBackEnd = res.data.data;
            if(DataFromBackEnd){
                set({Vendors:[DataFromBackEnd]})
                return {success:true}
            }
            else{
                return
            }
        } catch (error) {
            console.log(error.message)
            return {success:false , message:"Error at Vendor get ...!"}
        }
    },
    AddCheckout:async (Data) => {
        try {
            //Remove first dummy product
            Data.ProductItems = Data.ProductItems.filter(P => P.ProductName !== "");
            
            const Products = UseProduct.getState().Products;

            //Assign Checkout date as rundate
            Data.CheckoutDate = useOrg.getState().OrganizationData[0][0].RunDate
            //Assign Product IDs
            for (let Product of Data.ProductItems){
                let GlobalProductIndex =  Products[0].findIndex(Prod => Product.ProductName == Prod.ProductName);
                Product.ProductID = Products[0][GlobalProductIndex].ProductID
            }

            const Validation = Validate("AddCheckout", Data);
            if(!Validation.success){
                return {success:false , message:Validation.message || "Checkout validation failed."}
            }
            const res = await AxiosInstance.put('api/userservice/inv/add_checkout' , Data);
            const DataFromBackEnd = res.data.data;
        } catch (error) {
            console.log(error);
            return {success:false , message:error?.response.data.message || "Error processing this checkout"}
        }
        
    },
    FillOrderStates:async() => {
        try {
            const res = await AxiosInstance.get('/api/userservice/inv/get_orders');
            const DataFromBackEnd = res.data.data;

            //Fill states
            if(DataFromBackEnd){
                set({CurrentOrders:[DataFromBackEnd.CurrentOrders],
                    OrderHistory:[DataFromBackEnd.OrderHistory]})
            }
            return {success:true}
        } catch (error) {
            console.log(error)
            return {success:false , message:error}
        }
    },
    AddOrder:async(Data) => {
        try {
            //Remove first dummy product
            Data.ProductItems = Data.ProductItems.filter(P => P.ProductName !== "");
            const Validation = Validate("AddOrder", Data);
            //Assign Product IDs
            
            const Products = UseProduct.getState().Products;
            for (let Product of Data.ProductItems){
                let GlobalProductIndex =  Products[0].findIndex(Prod => Product.ProductName == Prod.ProductName);
                Product.ProductID = Products[0][GlobalProductIndex].ProductID
            }
            if(!Validation.success){
                return {success:false , message:Validation.message || "Checkout validation failed."}
            }
            const res = await AxiosInstance.put('api/userservice/inv/add_order' , Data);
            let DataFromBackEnd = res.data.data;

            //Stringify the order array
            DataFromBackEnd = DataFromBackEnd.map((Order) => ({...Order , OrderData:JSON.stringify(Order.OrderData)}))

            //Fill GlobalState:Order

            set((State) => ({
                CurrentOrders:[[...State.CurrentOrders[0] , ...DataFromBackEnd]]
            }))

            return {success:true , message:"Order placed successfully....!"};
        } catch (error) {
            console.log(error)
            return {success:false , message:error?.response?.data?.message ?? "Error while placing order"};
        }
    },
    ConfirmOrder:async(OrderID) => {
        try {
            const Validation = Validate("ConfirmOrder", OrderID);
            if(!Validation.success){
                return {success:false , message:Validation?.message || "order validation failed at client side"}
            }
            const res = await AxiosInstance.put('/api/userservice/inv/confirm_order' , {OrderID:OrderID});
            const DataFromBackEnd = res.data.data;
            //Return from server: {ProductData:{ProductID:NewQuantity} , TotalExpense:TotalExpense , OrderHistory}

            //Update client zustand objects
            set((state) => {
                            const NewOrders = state.CurrentOrders[0].filter((Order) => (Order.OrderID !== OrderID))
                            console.log("Zustand Neworders",NewOrders)
                            return{
                            //Update PNL
                            PNL: {
                                TotalRevenue: state.PNL.TotalRevenue,
                                TotalExpense: DataFromBackEnd.TotalExpense
                            },
                            //Update products quantity
                            Products: state.Products.map((Product) =>
                                DataFromBackEnd.ProductData.some((NewProduct) => NewProduct.ProductID === Product.ProductID)
                                ? { ...Product, Quantity: DataFromBackEnd.ProductData.find(P => P.ProductID === Product.ProductID).Quantity }
                                : Product),
                            //Update current orders
                            CurrentOrders:[[...NewOrders]],
                            
                            

                            //Update Order History
                            OrderHistory: [...state.OrderHistory , DataFromBackEnd.OrderHistory]
                            }});
            setTimeout(() => {
            console.log("✅ Updated CurrentOrders:", UseProduct.getState().CurrentOrders);
            }, 0);
            return {success:true , message:"Order delivery confirmed...!"}
        } catch (error) {
            return {success:false , message:error}
        }
    },
    GetEWMAAnalytics:async() => {
        try {
            const res = await AxiosInstance.get('/api/userservice/inv/get_ewma_analytics');

            const DataFromBackEnd = res?.data?.data;
            
            set({AverageLeadTime:[DataFromBackEnd.AverageLeadTime]})
        } catch (error) {
            console.log(error.message)
            return{success:true , message:error?.response?.data?.message ?? "Error while loading EWMA Analytics"};
        }
    },
    GetCurrency:async() => {
        try {
            const res = await AxiosInstance.get('/api/userservice/inv/get_currency');
            const DataFromBackEnd = res.data.data;

            if(DataFromBackEnd){
                set({Currency:[DataFromBackEnd]})
                return{success:true}
            }
        } catch (error) {
            console.log(error.message)
            return{success:true , message:error?.response?.data?.message ?? "Error while loading currency"};
            
        }
    },
    GetCurrentDayCheckout:async() => {
        try {
            const res = await AxiosInstance.get('/api/userservice/inv/get_today_checkout');
            const DataFromBackEnd = res.data.data;

            //Set Global states
            if(DataFromBackEnd){
                set({HighSellingProducts:[DataFromBackEnd.MostSellingProducts]});
            }
            
            return {success:true};
        } catch (error) {
            console.log(error)
            return {success:false , message:error?.response.data.message || "Error loading checkouts"}
        }
    },
    AddProduct:async(Data) => {
        try {
            const Validation = Validate('AddProduct' , Data);
            if(!Validation.success){
                return Validation
            }
            const res = await AxiosInstance.put('/api/userservice/inv/add_product' , Data);
            const DataFromBackEnd = res.data.data;

            set((state) => ({
                        Products: [[...state.Products[0], DataFromBackEnd.ProductData]],
                        PNL: {
                            ...state.PNL,
                            TotalExpense: state.PNL.TotalExpense + DataFromBackEnd.PNLData.TotalExpense
                        }
                        }));

        } catch (error) {
            console.log(error.message)
            return {success:false , message:"Error at Product PUT ...!"}
        }
    },
    AlterProduct:async(Data) => {
        try {
            const Validation = Validate("AlterProduct" , Data);
            if(!Validation.success){
                return {success:Validation.success , message: Validation.message}
            }
            Data.UpdateKeyValue = Object.fromEntries(Data.UpdateKeyValue)
            var res = await AxiosInstance.patch('/api/userservice/inv/alter_product' , Data);
            const DataFromBackEnd = res.data.data;

            //Set Global States
            Products[0].map(Prod => (Prod.ProductID === DataFromBackEnd.NewProduct.ProductID ? DataFromBackEnd.NewProduct : Prod))
            PNL = {...State , TotalExpense:DataFromBackEnd.NewPNL.TotalExpense} 

            return {success:true , message:"Updated product successfully"}
        } catch (error) {
            console.log(error.message)
            return {success:false , message:error.res.data.message ?? "Error while altering product"}
        }
    }
    ,
    AddVendor:async(Input) => {
        try {
            const Validation = Validate("AddVendor" , Input)
            if(! Validation.success){
                return {success:Validation.success , message: Validation.message}
            }
            const res = await AxiosInstance.put('/api/userservice/inv/add_vendor' , Input);
            const DataFromBackEnd = res.data.data; 
            if(!DataFromBackEnd){
                return {success:false , message: "Failed to add vendor"}
            }
            //Set in State
            set((State) => ({Vendors:[...State.Vendors , DataFromBackEnd]}));
            return {success:true , message: "Successfully added vendor"}
        } catch (error) {
            console.log(error.message)
            return {success:false , message:"Error at Vendor PUT ...!"}
        }
    },
    AddCategory : async(Input) => {
        try {
            const Validation =  Validate("AddCategory" , Input)
            if(! Validation.success){
                return {success:Validation.success , message: Validation.message}
            }
            const res = await AxiosInstance.put('api/userservice/inv/add_category' , Input);
            const DataFromBackEnd = res.data.data;

            //Set in State
            set((State) => ({Category:[State.Category , DataFromBackEnd]}));

            return {success:true , message:"Category added successfully , Add products in products page"}

        } catch (error) {
            console.log(error.message)
            return {success:false , message:error.response.data.message || "Failed to add category"}
        }
    },
    //Socket events and handlers
    InitInventorySocketEvents:async() => {
            try {
                //Initialize all socket events
                useUser.getState().SocketState.on(ClientSocketEventsEnum.PRODUCT_EVENT , (Payload) => {get().ProductEventHandler(Payload)});
            } catch (error) {
                console.log("error while init SocketEvents" , error)
            }
        },
    DeInitInventorySocketEvents:() =>{
        try {
            const TempSocket = useUser.getState().SocketState;
            if(!TempSocket) return;
            TempSocket.off();
        } catch (error) {
            console.log(error)
        }
    },
    ProductEventHandler:async(Payload) => {
        try {
            //Set Toast and Update Zustand States
            switch (Payload.EventType){
                case EventActionsEnum.ADD:
                    console.log("New Product socket event called...!")
                    set((state) => ({
                            Products: [[...state.Products[0], Payload.InventoryData.ProductData]],
                            PNL: {
                                ...state.PNL,
                                TotalExpense: state.PNL.TotalExpense + Payload.InventoryData.PNLData.TotalExpense
                            }
                        }));

                        //Add Socket Message
                        let SocketMessage = {Message:`${Payload.InventoryData.ProductData.ProductName} added to onventory. States updated..!`}
                        useUser.getState().UpdateSocketMessageState(SocketMessage);
                case EventActionsEnum.ALTER:
                    //Set Global States
                    set((State) => {
                        const NewProductState = Products[0].map(Prod => (Prod.ProductID === Payload.NewProduct.ProductID ? Payload.NewProduct : Prod))    

                        return {
                            Products:[[NewProductState]],
                            PNL : {...State.PNL , TotalExpense:Payload.NewPNL.TotalExpense} 
                        }
                    })
                    
            }
        } catch (error) {
            console.log("Error at ProductEventHandler: " ,error)
            return {success:false , message:error}
        }

    }


}))

const Validate =  (ValidationType , Data) => {

    if(ValidationType === "AddCategory"){
        const {CategoryName , CategoryDescription} = Data;
        if(!CategoryName || !CategoryDescription){
            return {success:false , message:"Please fill all the fields ...!"}
        }
        return {success:true , message:"Validation successfull ...!"}
    }
    else if(ValidationType === "AddVendor"){
        const {VendorName , VendorLocation , VendorAPIType , VendorAPI} = Data;
        if([VendorName , VendorLocation , VendorAPIType , VendorAPI].some(Element => undefined)){
            return {success:false , message:"Please fill all the fields ...!"}
        }
        return {success:true , message:"Validation successfull ...!"}
    }
    else if(ValidationType === "AddProduct"){
        let {ProductName , ProductPrice , CurrencyName , ActualPrice  , CategoryName , ProductImage , VendorName , ReorderThreshold , Unit , Quantity , ExpirationDate} = Data;
        if([ProductName , ProductPrice , CurrencyName , ActualPrice  , CategoryName , ProductImage , VendorName , ReorderThreshold , Unit , Quantity].some(Element => undefined)){
            return {success:false , message:"Please fill all the fields ...!"}
        }
        //Expiration date conversion
        if(Data.ExpirationDate == ''){
            Data.ExpirationDate = '9999-12-31'
        }
        return {success:true , message:"Validation successfull ...!"}
    }
    else if(ValidationType === "AlterProduct"){
        let {UpdateKeyValue , ProductID} = Data;
        if([UpdateKeyValue , ProductID].some(Element => undefined)){
            return {success:false , message:"Please fill all the fields ...!"}
        }

        //Validate Update Datas
        if(UpdateKeyValue.has("ProductName")){
            let Value = UpdateKeyValue.get("ProductName")
            if(Value.length < 1 || Value.length > 15){
                return {success:false , message:"Invalid product name updation ...!"}
            }
        }
        return {success:true , message:"Validation successfull ...!"}
    }
    else if(ValidationType == "AddCheckout"){
        const {TotalItems , ProductItems , TotalCost} = Data;
        if(TotalItems < 1){
            return {success:false , message:"Select atleast one item to checkout"};
        }
        return {success:true};
    }
    else if(ValidationType == "AddOrder"){
        const {TotalItems , ProductItems , TotalCost} = Data;
        if(TotalItems < 1){
            return {success:false , message:"Select atleast one item to checkout"};
        }
        return {success:true};
    }
    else if(ValidationType == "ConfirmOrder"){
        if(!Data || Data === ''){
            return {success:false , message:"Please reselect a order to confirm."}
        }
        return {success:true};
    }
}
export default UseProduct;