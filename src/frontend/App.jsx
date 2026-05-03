import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import Dashboard from "./dashboard";
import Home from "./Home";
import History from "./history";
import PatientDashboard from "./PatientDashboard";
import ForgotPassword from "./ForgotPassword";
import KnowMore from "./KnowMore";
import Reports from "./Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/history" element={<History />} />
         <Route path="/know-more" element={<KnowMore />} />
         <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}