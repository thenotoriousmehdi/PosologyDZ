import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Preparations from "./pages/Preparations";
import DetailsPatient from "./pages/DetailsPatient";
import Patients from "./pages/Patients";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/Login" element={<Login/>}/>  
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Patients/>}/> 
          <Route path="/Preparations" element={<Preparations/>}/>
          <Route path="/DetailsPatient" element={<DetailsPatient/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;