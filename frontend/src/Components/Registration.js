import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registration Successful");
                navigate("/login")
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            alert("Network Error");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="example@google.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must contain at least more than 8 letters conatiang 1 uppercase letter, 1 number, and 1 special character."
                            required
                        />
                        <small className="form-text text-muted">
                            Must contain at least more than 8 letters conatiang  1 uppercase letter, 1 number, and 1 special character.
                        </small>
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Register
                    </button>
                </form>

                <div className="text-center mt-3">
                    <p>
                        Already have an account?{" "}
                        <a href="/login" className="text-primary" onClick={(e) => {
                            e.preventDefault();
                            navigate("/login");
                        }}>
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
