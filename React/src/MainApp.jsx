import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Goals from "./pages/Goals";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Application from "./Application";
import UserPage from "./pages/UserPage";

const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Application/>} />
        <Route path="/me" element={<UserPage/>} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default MainApp;
