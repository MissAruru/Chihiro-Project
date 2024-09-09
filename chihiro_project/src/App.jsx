import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Login } from '../pages/Login/login'
import { Inicio } from '../pages/Inicio/Inicio'
import { Origen } from '../pages/El_origen/El_origen'
import { Tragedia } from '../pages/La_tragedia/Tragedia'
import { Personajes } from '../pages/Personajes/Personajes'
import { BrowserRouter, Routes, Route} from 'react-router-dom'



function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path ='/' element={<Login/>}/>
        <Route path ='/inicio' element={<Inicio/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
