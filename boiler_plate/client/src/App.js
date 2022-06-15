import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        <nav>
         
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage/> }  />
          <Route path="/register" element = {<RegisterPage/>}  />
          <Route path="/" element={<LandingPage />} />
            
        </Routes>
      </div>
    </Router>
  )
}

export default App
