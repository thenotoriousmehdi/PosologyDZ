import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Preparations from "./pages/Preparations";
import PatientDetails from "./pages/PatientDetails";
import Patients from "./pages/Patients";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Forbidden from "./pages/Forbidden";
import Users from "./pages/Users";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/Login" element={<Login />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Patients />} />

          <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="Users" element={<Users />} />
          </Route>

          <Route path="/Preparations" element={<Preparations />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/403" element={<Forbidden />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
