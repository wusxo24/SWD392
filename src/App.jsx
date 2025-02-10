import { useState } from 'react'
import React from 'react';
import Navbar from './components/navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './login/login';
import Register from './login/register';
function App() {

  return (
    <div className="App">
  <BrowserRouter>
  <Navbar/>
    <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
      </Routes>
  </BrowserRouter>
  </div>
  )
}

export default App
