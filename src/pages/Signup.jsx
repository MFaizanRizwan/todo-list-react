import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/login.css";

function SignUp() {
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "TODO App | Sign Up";
    }, []);

    function getData(user) {
        return {
            token: user.username,
            role: user.role,
        };
    }

    function handleSignup() {
        let usersList = JSON.parse(localStorage.getItem("Users")) || [];

        const existingUser = usersList.find((user) => user.username === username);

        if (!existingUser) {
            const newUser = {
                firstname,
                lastname,
                username,
                password,
                role: "user"
            };

            usersList.push(newUser);
            localStorage.setItem("Users", JSON.stringify(usersList));

            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");

            localStorage.setItem("authToken", newUser.username);
            localStorage.setItem("userRole", newUser.role);

            navigate("/");
        } else {
            alert("User already exists");
        }
    }

    return (
        <main>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignup();
                }} >

                <h1>Sign Up</h1>

                <input
                    type="text"
                    className="text-input"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)} />

                <input
                    type="text"
                    className="text-input"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)} />

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
                    Sign Up
                </button>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">Login instead</Link>
                </p>
            </form>
        </main>
    );
}

export default SignUp;