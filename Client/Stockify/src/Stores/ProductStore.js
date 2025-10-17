import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';
import useOrg from '../Stores/OrgStore.js'

 const UseProduct = create((set , get) => ({
    IsAuthenticated:false,
    
    //Fallback States
    IsProductsLoading:false,
    Category:[],
    Products:[],
    Vendors:[],
    Currency:[],
    HighSellingProducts:[],
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
            console.log(useOrg.getState().OrganizationData , useOrg.getState().OrganizationData)
            Data.CheckoutDate = useOrg.getState().OrganizationData.RunDate
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
    GetCurrency:async() => {
        try {
            const res = await AxiosInstance.get('/api/userservice/inv/get_currency');
            const DataFromBackEnd = res.data.data;

            if(DataFromBackEnd){
                set({Currency:[DataFromBackEnd]})
                return{success:true}
            }
        } catch (error) {
            return{success:true , message:error?.response?.data?.message ?? "Error while loading currency"};
            console.log(error.message)
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

            if(DataFromBackEnd){
                set((state) => ({
                            Products: [...state.Products, DataFromBackEnd.ProductData],
                            PNL: {
                                ...state.PNL,
                                TotalExpense: state.PNL.TotalExpense + DataFromBackEnd.PNLData.TotalExpense
                            }
                            }));
                return{success:true , message:"Product added successfully"}
            }
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
}
export default UseProduct;