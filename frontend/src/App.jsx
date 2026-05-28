import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/HomePage/Homepage";
import Register from "./components/Users/Register";
import Login from "./components/Users/Login";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
