import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//Global States 
import useUser from './Stores/UserStore';

//Pages
import LoginPage from './Pages/LoginPage/LoginPage';
import CreateOrJoinOrgPage from './Pages/CreateOrJoinOrgPage/CreateOrJoinOrgPage.jsx';
import HomePage from './Pages/HomePage/HomePage.jsx';
import { ToastContainer } from 'react-toastify';
import ShowToast from './Pages/Components/Toast/Toast.js';
import PageSuspense from './Pages/Components/Suspense Components/PageSuspense/PageSuspense.jsx';
import CreateOrgPage from './Pages/CreateOrgPage/CreateOrgPage.jsx';


//UseEffects
//TBD:UseEffect to send cookie and validate to reach certain pages



function App() {
  const { IsAuthenticated , UserData , ValidateUser , GetLoadingTexts , IsPageLoading , OrganizationData} = useUser();
  useEffect(() => {
     const response = ValidateUser()
     ShowToast(response.success , response.message)
  } , []);

  useEffect(() => {
     GetLoadingTexts();
     
  } , []);
  return (
    <div className='Screen'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element = {IsAuthenticated ? OrganizationData.OrganizationID !== 1 ? <Navigate to={'/home'} /> : IsPageLoading ? <PageSuspense /> : <Navigate to={'/create-join-org'} /> : <Navigate to={"/login"} /> } />
          
          <Route path = {'/' || '/home' } element = {IsAuthenticated ? <HomePage /> : IsPageLoading ? <PageSuspense /> : <LoginPage />} />

          <Route path = '/create-join-org'  element = {IsPageLoading ? <PageSuspense /> : IsAuthenticated ? OrganizationData.OrganizationID == 1 ? <CreateOrJoinOrgPage /> : <Navigate to = {'/home'}/ > : <Navigate to = {'/login'} />}/>
          
          <Route path='/create-org' element = {IsAuthenticated ? IsPageLoading ? <PageSuspense /> : OrganizationData.OrganizationID == 1  ?  <CreateOrgPage /> : <Navigate to={"/home"} /> : <Navigate to={"/login"} />} />

          {/* <Route path='/invite-to-org' element = {IsAuthenticated ? OrganizationData.OrganizationID !== 1 ? } */}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default App
