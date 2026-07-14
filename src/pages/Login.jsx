import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/login.css";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "TODO App | Login";
    }, []);

    function validateUser(username, password) {
        let usersList = JSON.parse(localStorage.getItem("Users")) || [];

        return usersList.find(
            (user) => user.username === username && user.password === password
        );
    }

    function getData(user) {
        return {
            token: user.username,
            role: user.role,
        };
    }

    function handleLogin() {
        const user = validateUser(username, password);

        if (user) {
            const data = getData(user);

            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userRole", data.role);

            if (data.role === "user") {
                navigate("/");
            } else {
                navigate("/dashboard");
            }
        } else {
            alert("Password or username mismatch");
        }
    }

    return (
        <div className="login-container">
            <main>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }} >

                    <h1>Login</h1>

                    <input
                        type="text"
                        className="text-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />

                    <input
                        type="password"
                        className="text-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit" className="submit-btn">
                        Login
                    </button>

                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup">Sign Up instead</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}

export default Login;