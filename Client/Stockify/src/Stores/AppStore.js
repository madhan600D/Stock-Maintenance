import { create } from 'zustand';
import AxiosInstance from '../Lib/AxiosInstance.js';

//SubPages
import InviteToOrgPage from '../Pages/InviteToOrgPage/InviteToOrgPage.jsx';

const URLToPage = {'/invite-to-org':InviteToOrgPage}

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