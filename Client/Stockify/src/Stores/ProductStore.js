import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';

 const UseProduct = create((set , get) => ({
    IsAuthenticated:false,
    
    //Fallback States
    IsProductsLoading:false,
    Category:[],
    Products:[],
    
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
                return {success:true , data:DataFromBackEnd}
            }
            else{
                return
            }
        } catch (error) {
            console.log(error.message)
            return {success:false , message:"Error at organization validation ...!"}
            
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
}
export default UseProduct;