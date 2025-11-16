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
import TasksPage from '../Pages/SubPages/TasksPage/TasksPage.jsx';
import InfoPage from '../Pages/SubPages/InfoPage/InfoPage.jsx';

const URLToPage = {'/invite-to-org':InviteToOrgPage , '/dashboard': DashboardPage , '/category':AddCategoryPage , '/vendors':VendorPage , '/products' : ProductPage , '/checkouts':CheckoutPage , '/profile':ProfilePage , '/orgpage':OrganizationPage , '/orders':OrderPage , '/tasks' : TasksPage , '/info':InfoPage};

const useApp = create((set , get) => ({
    CurrentPage:ProfilePage,
    SideBarState:'OPEN',
    
    SetCurrentPage: async(NewURL) => {
        try {
            //Map pages accordingly 
            set({CurrentPage:URLToPage[NewURL]})
            return

        } catch (error) {
            console.log(error)
        }
    },
    SetSideBarState:async() =>{
        try {
            set((State) => ({SideBarState:State.SideBarState = State?.SideBarState == 'OPEN' ? 'CLOSE' : 'OPEN'}))
        } catch (error) {
            console.log(error)
        }
    }
}))


export default useApp;