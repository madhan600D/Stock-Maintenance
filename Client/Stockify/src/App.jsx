import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useAsyncError } from "react-router-dom";

//Global States 
import useUser from './Stores/UserStore';

//Pages
import LoginPage from './Pages/LoginPage/LoginPage';
import CreateOrJoinOrgPage from './Pages/CreateOrJoinOrgPage/CreateOrJoinOrgPage.jsx';
import InviteToOrgPage from './Pages/SubPages/InviteToOrgPage/InviteToOrgPage.jsx';
import HomePage from './Pages/HomePage/HomePage.jsx';
import { ToastContainer } from 'react-toastify';
import ShowToast from './Pages/Components/Toast/Toast.js';
import PageSuspense from './Pages/Components/Suspense Components/PageSuspense/PageSuspense.jsx';
import CreateOrgPage from './Pages/CreateOrgPage/CreateOrgPage.jsx';
import SideBar from './Pages/Components/SideBar/SideBar.jsx';
import JoinOrgPage from './Pages/JoinOrgPage/JoinOrgPage.jsx';

//Components
import PageHolder from './Pages/Components/PageHolder/PageHolder.jsx';

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
      
      <div className='Routes'>
      <BrowserRouter>
        <ToastContainer />
        <SideBar />
        <Routes>
          <Route path="/login" element={IsAuthenticated ? <Navigate to={'/home'} /> : <LoginPage />} />

          <Route
            path="/home"
            element={IsAuthenticated ? OrganizationData.OrganizationID !== 1 ? <HomePage /> : <Navigate to={'/create-join-org'} /> : <Navigate to={'/login'} />}
          />
          <Route
            path="/"
            element={IsAuthenticated ? OrganizationData.OrganizationID !== 1 ? <HomePage /> : <Navigate to={'/create-join-org'} /> : <Navigate to={'/login'} />}
          />

          <Route
            path="/create-join-org"
            element={IsAuthenticated ? OrganizationData.OrganizationID !== 1 ? <Navigate to={'/home'} /> : <CreateOrJoinOrgPage /> : <Navigate to={'/login'} />}
          />

          <Route
            path="/create-org"
            element={IsAuthenticated ? OrganizationData.OrganizationID !== 1 ? <Navigate to={'/home'} /> : <CreateOrgPage /> : <Navigate to={'/login'} />}
          />
          <Route
            path='/join-org'
            element = {IsPageLoading ? <PageSuspense /> : IsAuthenticated ? OrganizationData.OrganizationID == 1 ? <JoinOrgPage /> : <Navigate to = {'/home'} /> : <Navigate to = {'/login'} />} />
    </Routes>
  </BrowserRouter>
  </div>
      {/* <ToastContainer /> */}
    </div>
  )
}

export default App
