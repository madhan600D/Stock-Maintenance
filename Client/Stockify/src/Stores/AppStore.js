import { create } from 'zustand';

//SubPages
import InviteToOrgPage from '../Pages/SubPages/InviteToOrgPage/InviteToOrgPage.jsx';
import DashboardPage from '../Pages/SubPages/DashboardPage/DashboardPage.jsx';
import AddCategoryPage from '../Pages/SubPages/AddCategoryPage/AddCategoryPage.jsx';
import VendorPage from '../Pages/SubPages/VendorPage/VendorPage.jsx';
import ProductPage from '../Pages/SubPages/ProductPage/ProductPage.jsx';
import CheckoutPage from '../Pages/SubPages/CheckoutPage/CheckoutPage.jsx';
import ProfilePage from '../Pages/SubPages/ProfilePage/ProfilePage.jsx';
import OrganizationPage from '../Pages/SubPages/OrganizationPage/OrganizationPage.jsx';
import OrderPage from '../Pages/SubPages/OrderPage/OrderPage.jsx';

const URLToPage = {'/invite-to-org':InviteToOrgPage , '/dashboard': DashboardPage , '/category':AddCategoryPage , '/vendors':VendorPage , '/products' : ProductPage , '/checkouts':CheckoutPage , '/profile':ProfilePage , '/orgpage':OrganizationPage , '/orders':OrderPage}

const useApp = create((set , get) => ({
    CurrentPage:ProfilePage,
    
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