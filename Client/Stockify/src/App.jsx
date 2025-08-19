import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useAsyncError } from "react-router-dom";

//Global States 
import useUser from './Stores/UserStore';

//Pages
import LoginPage from './Pages/LoginPage/LoginPage';
import CreateOrJoinOrgPage from './Pages/CreateOrJoinOrgPage/CreateOrJoinOrgPage.jsx';
import InviteToOrgPage from './Pages/InviteToOrgPage/InviteToOrgPage.jsx';
import HomePage from './Pages/HomePage/HomePage.jsx';
import { ToastContainer } from 'react-toastify';
import ShowToast from './Pages/Components/Toast/Toast.js';
import PageSuspense from './Pages/Components/Suspense Components/PageSuspense/PageSuspense.jsx';
import CreateOrgPage from './Pages/CreateOrgPage/CreateOrgPage.jsx';
import SideBar from './Pages/Components/SideBar/SideBar.jsx';


//UseEffects
//TBD:UseEffect to send cookie and validate to reach certain pages



function App() {
 
  const { IsAuthenticated , UserData , ValidateUser , GetLoadingTexts , IsPageLoading , OrganizationData} = useUser();
  useEffect(() => {
    const AsyncUserValidate = async () =>{
      const response =  await ValidateUser()
      ShowToast(response.success , response.message)
    }
    AsyncUserValidate()
  } , []);

  useEffect(() => {
     GetLoadingTexts();
     
  } , []);

  //Protected Routing
  const ProtectedOrgRoute = ({Route , Url}) => {
    try {
      if(IsPageLoading){
        return <PageSuspense />
      }
      if (IsAuthenticated){
        if(OrganizationData.OrganizationID === 1){
            return <Navigate to={'/create-join-org'} />
          }

      }
      else{
          return <Navigate to={'/login'} replace/>
      }
      SetCurrentRedirect(Url);
      return Route;
    } catch (error) {
      console.log("Error at React-Router-Dom: Routing to login Page")
      return <Navigate to={'/login'} replace/>
    }
  }


  return (
    <div className='Screen'>
      
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={IsAuthenticated ? <Navigate to={'/home'} /> : <LoginPage />} />

          <Route
            path="/home"
            element={IsAuthenticated ? OrganizationData.OrganizationID !== 1 ? <HomePage /> : <Navigate to={'/create-join-org'} /> : <LoginPage />}
          />

          <Route
            path="/create-join-org"
            element={IsAuthenticated ? OrganizationData.OrganizationID !== 1 ? <Navigate to={'/home'} /> : <CreateOrJoinOrgPage /> : <LoginPage />}
          />

          <Route
            path="/create-org"
            element={IsAuthenticated ? OrganizationData.OrganizationID !== 1 ? <Navigate to={'/home'} /> : <CreateOrgPage /> : <LoginPage />}
          />

          <Route
            path="/invite-to-org"
            element = {<InviteToOrgPage />}
          />
    </Routes>
  </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default App
