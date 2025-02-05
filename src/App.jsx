import { useState } from 'react'
import React from 'react';
import Navbar from './components/navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className="App">
  <BrowserRouter>
  <Navbar/>
    <Routes>
        <Route></Route>
      </Routes>
  </BrowserRouter>
  </div>
  )
}

export default App
