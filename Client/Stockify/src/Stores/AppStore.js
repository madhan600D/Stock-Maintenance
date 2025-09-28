import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';

//SubPages
import InviteToOrgPage from '../Pages/SubPages/InviteToOrgPage/InviteToOrgPage.jsx';
import DashboardPage from '../Pages/SubPages/DashboardPage/DashboardPage.jsx';

const URLToPage = {'/invite-to-org':InviteToOrgPage , '/dashboard': DashboardPage}

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