import { useState } from 'react'


import './App.css'
import Homepage from './Component/Public/Home_page'
import Loginpage from './Component/Public/Login_page'
import Registerpage from './Component/Public/Register_page'
import Forgetpasswordpage from './Component/Public/ForgetPassword_page'
import { Routes, Route } from 'react-router-dom'


function App() {
  return (

    <>
    {/* <BrowserRouter> */}
    <Routes>
   <Route  path='/' element= {<Homepage/>}/>   
   <Route  path='/login' element= {   <Loginpage/>}/>   
   <Route  path='/register' element= { <Registerpage/>}/>  
   <Route  path='/forgetpassword' element= { <Forgetpasswordpage/>}/>  


   
    </Routes>
    {/* </BrowserRouter> */}
     
    </>
  )
}

export default App
