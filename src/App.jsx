import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { setUser, clearUser } from "./store/authSlice";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TaskPage from "./pages/TaskPage";
import Details from "./pages/Details";
import Dashboard from "./pages/Dashboard";
import DashboardDetails from "./pages/DashboardDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const role = localStorage.getItem("userRole") || "user";
        dispatch(setUser({ 
          user: { uid: currentUser.uid, email: currentUser.email }, 
          role 
        }));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
          <Route path="/task/:id" element={<TaskPage />} />
          <Route path="/details/:id" element={<Details />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/" element={<Home />} />
          <Route path="/task" element={<TaskPage />} />
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