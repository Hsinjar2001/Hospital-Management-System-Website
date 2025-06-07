import React from 'react';
import LoginPage from './Component/Public/Login_page';
import RegisterPage from './Component/Public/Register_page';
import HomePage from './Component/Public/Home_page';

function App(){
  return (
    <>
      <LoginPage />
      <RegisterPage/>
      <HomePage/>
    </>
  );
}

export default App;