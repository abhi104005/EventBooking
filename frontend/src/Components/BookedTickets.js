import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";

export function BookedTickets() {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();
    
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;
    const user = token ? jwtDecode(token) : null; 
    const uid = user?.id;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        if (!token) {
            navigate("/login"); 
            return;
        }

        fetch(`http://localhost:8080/booked-tickets/${uid}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then((response) => {
            if (response.status === 403) {
                alert("Your session has been expired!! redirecting to relogin...");
                return navigate("/login");
            } else {
                return response.json()
            }
        })
        .then((data) => setTickets(data))
        .catch((err) => console.error("Error fetching booked tickets:", err));
    }, [navigate, token, uid]);

    return (
        <div >
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <a className="navbar-brand" href="/home">Event Booking</a>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/booked-tickets">Booked Tickets</a>
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
            <h2 className="text-center my-4">🎟️ My Booked Tickets</h2>

            {tickets.length > 0 ? (
                <div className="row">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="col-lg-4 col-md-6 mb-4">
                            <div className="card shadow">
                                <div className="card-body">
                                    <h5 className="card-title">{ticket.event.name} 🎉</h5>
                                    <p className="card-text">
                                        <strong>📅Date:</strong> {ticket.event.date} <br />
                                        <strong> 📍  Location:</strong> {ticket.event.location} <br />
                                        <strong>🎟️Seats Booked:</strong> {ticket.tickets} 
                                    </p>
                                    <p className="card-text">About Event :- {ticket.event.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">No booked tickets found ❌</p>
            )}
        </div>
    );
}
