import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function BookEvent() {
    const { eventId } = useParams();
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState(1);
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token ❌");
                localStorage.removeItem("token");
                navigate("/login");
            }
        } else {
            console.error("No token found ❌");
            navigate("/login");
        }
    }, [navigate, token]);

    useEffect(() => {
        fetch(`http://localhost:8080/events/${eventId}`, {
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
            .then((data) => setEvent(data))
            .catch((err) => console.error("Error fetching event:", err));
    }, [eventId, token, navigate]);

    const handleBooking = () => {

        fetch("http://localhost:8080/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                user_id: user.id,
                event_id: event.id,
                tickets: seats
            })
        })
            .then((res) => {
                if (res.status === 401) {
                    alert("Session Expired! Redirecting to login page...");
                    localStorage.removeItem("token");
                    setTimeout(() => navigate("/login"), 2000);
                    return Promise.reject("Unauthorized");
                }
                return res.json();
            })
            .then(() => {
                alert("Booking successful!");
                navigate("/booked-tickets");
            })
            .catch((err) => console.error("Booking failed:", err));
    };

    if (!event) return <p>Loading event details...</p>;

    return (
        <div >
            {/* Navbar */}
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
            <h2 className="text-center">{event.name}</h2>
            <p className="text-center text-muted">{event.description}</p>

            <div className="card p-4 mx-auto" style={{ maxWidth: "500px" }}>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Seats Available:</strong> {event.available_seats}</p>

                <label>Select Seats:</label>
                <input
                    type="number"
                    className="form-control mb-3"
                    min="1"
                    max={event.available_seats}
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                />

                <button className="btn btn-success w-100" onClick={handleBooking}>
                    Confirm Booking
                </button>
            </div>
        </div>
    );
}
