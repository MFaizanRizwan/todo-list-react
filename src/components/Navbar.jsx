import { useNavigate } from "react-router-dom";
import "../css/navbar.css";

function Navbar({ showSearch = false, search, onSearchChange }) {
    const navigate = useNavigate();

    function handleLogout() {
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
            
            {showSearch && (
                <div className="navbar-search">
                    <input
                        type="search"
                        className="premium-search-bar"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={onSearchChange}
                    />
                </div>
            )}

            <div className="navbar-actions">
                <button className="premium-logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;
