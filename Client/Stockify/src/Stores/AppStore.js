import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';

//SubPages
import InviteToOrgPage from '../Pages/SubPages/InviteToOrgPage/InviteToOrgPage.jsx';
import DashboardPage from '../Pages/SubPages/DashboardPage/DashboardPage.jsx';
import AddCategoryPage from '../Pages/SubPages/AddCategoryPage/AddCategoryPage.jsx';
import VendorPage from '../Pages/SubPages/VendorPage/VendorPage.jsx';
import ProductPage from '../Pages/SubPages/ProductPage/ProductPage.jsx';

const URLToPage = {'/invite-to-org':InviteToOrgPage , '/dashboard': DashboardPage , '/category':AddCategoryPage , '/vendors':VendorPage , '/products' : ProductPage}

const useApp = create((set , get) => ({
    CurrentPage:'',
    
    SetCurrentPage: async(NewURL) => {
        try {
            //Map pages accordingly 
            set({CurrentPage:URLToPage[NewURL]})
            return

        } catch (error) {
            
        }
    },
}))


export default useApp;