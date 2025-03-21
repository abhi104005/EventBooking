import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });

            const data = await response.json();
            if (response.ok) {
                const decoded = jwtDecode(data.token);

                setMessage("Login Successful");
                if (decoded.role === "admin") {
                    localStorage.setItem("token", data.token);
                    return navigate("/adminHome");
                }
                setMessage("Login Successful");
                localStorage.setItem("token", data.token);
                return navigate("/home");
            } else {
                setMessage(data.error || "Login Failed");
            }
        } catch (error) {
            setMessage("Network Error");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="form-check mt-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="showPassword"
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label className="form-check-label" htmlFor="showPassword">
                                Show Password
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
                {message && <p className="mt-3 text-center text-danger">{message}</p>}
                <div className="text-center mt-3">
                    <p>
                        Don't have an account?{" "}
                        <a href="/registerform" className="text-primary" onClick={(e) => {
                            e.preventDefault();
                            navigate("/registerform");
                        }}>
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

