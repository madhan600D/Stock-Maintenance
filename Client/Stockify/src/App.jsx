import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './Pages/LoginPage/LoginPage';



function App() {
  return (
    <div className='Screen'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element = {<LoginPage />} />
          <Route path = {'/' || '/login' } element = {<HomePage />} />
          <Route path = '/join-org'  element = {<CreateOrJoinOrg />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
