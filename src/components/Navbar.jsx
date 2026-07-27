import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import "../css/navbar.css";

function Navbar() {
    const navigate = useNavigate();

    async function handleLogout() {
        await signOut(auth);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        navigate("/login");
    }

    function handleLogoClick() {
        const role = localStorage.getItem("userRole");
        if (role === "admin") {
            navigate("/dashboard");
        } else {
            navigate("/");
        }
    }

    return (
        <header className="premium-navbar">
            <div className="navbar-brand" onClick={handleLogoClick}>
                <h2>Todo App</h2>
            </div>

            <div className="navbar-actions">
                <button className="premium-logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;
