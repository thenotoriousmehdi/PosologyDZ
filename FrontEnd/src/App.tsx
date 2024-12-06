import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Hi from "./pages/hi";
function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Login/>}/>  
            <Route path="/hi" element={<Hi/>}/> 
          </Routes>
    </Router>
  );
}

export default App
