import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Global States 
import useUser from './Stores/UserStore';

//Pages
import LoginPage from './Pages/LoginPage/LoginPage';
import CreateOrJoinOrgPage from './Pages/CreateOrJoinOrgPage/CreateOrJoinOrgPage.jsx';
import HomePage from './Pages/HomePage/HomePage.jsx';
import { ToastContainer } from 'react-toastify';
import ShowToast from './Pages/Components/Toast/Toast.js';
import PageSuspense from './Pages/Components/Suspense Components/PageSuspense/PageSuspense.jsx';


//UseEffects
//TBD:UseEffect to send cookie and validate to reach certain pages



function App() {
  const { IsAuthenticated , UserData , ValidateUser , GetLoadingTexts , IsPageLoading} = useUser();
  useEffect(() => {
     const response = ValidateUser()
     ShowToast(response.success , response.message)
  } , [ValidateUser]);

  useEffect(() => {
     GetLoadingTexts();
     
  } , []);
  return (
    <div className='Screen'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element = {IsAuthenticated ? <HomePage /> : IsPageLoading ? <PageSuspense /> : <LoginPage /> } />
          <Route path = {'/' || '/home' } element = {IsAuthenticated ? <HomePage /> : IsPageLoading ? <PageSuspense /> : <LoginPage />} />

          <Route path = '/create-join-org'  element = {IsAuthenticated ? IsPageLoading ? <PageSuspense /> : <CreateOrJoinOrgPage /> : IsPageLoading ? <PageSuspense /> : <LoginPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default App
