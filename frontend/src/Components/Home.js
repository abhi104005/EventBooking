import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
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

    return (
        <div className="text-center">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <a className="navbar-brand" href="/home">Event Booking</a>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/update">Update Profile</a>
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
            <div>
                <h2 className="mb-3">Welcome, {user?.name} </h2>
                
                <div className="mt-4">
                    <button className="btn btn-primary m-2" onClick={() => navigate("/booked-tickets")}>
                        View Booked Tickets 🎟️
                    </button>
                    <button className="btn btn-success m-2" onClick={() => navigate("/book")}>
                        Book New Ticket 🎫
                    </button>
                </div>
            </div>
        </div>
    );
}
