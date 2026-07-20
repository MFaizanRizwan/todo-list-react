import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddTask from "./pages/AddTask";
import UpdateTask from "./pages/UpdateTask";
import Details from "./pages/Details";
import Dashboard from "./pages/Dashboard";
import DashboardDetails from "./pages/DashboardDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
          <Route path="/update/:id" element={<UpdateTask />} />
          <Route path="/details/:id" element={<Details />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTask />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard_details" element={<DashboardDetails />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;