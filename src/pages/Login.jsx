import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import "../css/login.css";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "TODO App | Login";
    }, []);

    async function handleLogin() {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const role = email === import.meta.env.VITE_FIREBASE_ADMIN_EMAIL ? "admin" : "user";

            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");

            localStorage.setItem("authToken", user.uid);
            localStorage.setItem("userRole", role);

            dispatch(setUser({
                user: { uid: user.uid, email: user.email },
                role
            }));

            if (role === "user") {
                navigate("/");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <main className="login-main">
                <form className="login-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }} >

                    <h1 className="login-title">Login</h1>

                    <input
                        type="email"
                        className="login-text-input"
                        placeholder="Email Address"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)} />

                    <input
                        type="password"
                        className="login-text-input"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup" className="login-link">Sign Up instead</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}

export default Login;