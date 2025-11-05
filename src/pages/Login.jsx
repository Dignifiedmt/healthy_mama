import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

// Simple admin login page.
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(email, password)) {
            navigate("/admin");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-4">Shiga</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block mb-2 p-2 border w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block mb-2 p-2 border w-full"
                />
                <button type="submit" className="bg-blue-800 text-white p-2 rounded w-full">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
