import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shows from "./pages/Shows";
import Booking from "./pages/Booking";
import Success from "./pages/Success";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import TheaterDashboard from "./pages/TheaterDashboard";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shows/:id" element={<Shows />} />
        <Route path="/book/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/success" element={<Success />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute role="theater">
      <TheaterDashboard />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}