import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SuperAdminHome(){

    const [user,setUser] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUser(decoded);
                } catch (error) {
                    console.error("Invalid token");
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } else {
                console.error("No token found");
                navigate("/login");
            }
        }, [navigate]);

    return(<div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <a className="navbar-brand" href="/sadmin">Event Booking</a>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/regreq">Requests</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        {!isLoggedIn ? (
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
            <h2 className="mb-3">Welcome, {user?.name} </h2>
    </div>)
}