import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Preparations from "./pages/Preparations";

import Patients from "./pages/Patients";
//import Patients from "./pages/Patients"
function App() {
  return (
    <Router>
          <Routes>
          <Route path="/" element={<Patients/>}/> 
            <Route path="/Login" element={<Login/>}/>  
            <Route path="/Preparations" element={<Preparations/>}/>
          </Routes>
    </Router>
  );
}

export default App
