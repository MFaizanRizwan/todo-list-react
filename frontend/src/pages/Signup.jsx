
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addUserToFirestore } from "../services/user_services/addUserToFirestore";
import "../css/login.css";

function SignUp() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "TODO App | Sign Up";
    }, []);

    async function handleSignup() {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let role = "user";
            if (email === import.meta.env.VITE_FIREBASE_ADMIN_EMAIL) {
                role = "admin";
            }

            // Store email + role in Firestore (no password)
            await addUserToFirestore(user.uid, email, role);

            // Sign out the user so they have to actually log in
            await auth.signOut();

            alert("Signup successful! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error("Error signing up:", error);
            alert(error.message);
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
                        handleSignup();
                    }} >

                    <h1 className="login-title">Sign Up</h1>

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

                    <input
                        type="password"
                        className="login-text-input"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)} />

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>

                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="login-link">Login instead</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}

export default SignUp;