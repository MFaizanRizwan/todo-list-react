import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddTask from "./pages/AddTask";
import UpdateTask from "./pages/UpdateTask";
import Details from "./pages/Details";
import Dashboard from "./pages/Dashboard";
import DashboardDetails from "./pages/DashboardDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/add" element={<AddTask />} />

        <Route path="/update/:id" element={<UpdateTask />} />


        <Route path="/details" element={<Details />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/dashboard_details" element={<DashboardDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;