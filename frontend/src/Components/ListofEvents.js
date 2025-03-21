import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";

export function EventList() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    useEffect(() => {
        if (token) {
            try {
                jwtDecode(token);
            } catch (error) {
                console.error("Invalid token");
                localStorage.removeItem("token");
                navigate("/login");
            }
        } else {
            // console.error("No token found");
            // navigate("/login");
        }
    }, [navigate, token]);

    useEffect(() => {
        fetch("http://localhost:8080/events", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
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
            .then((data) => setEvents(data))
            .catch((err) => console.error("Error fetching events:", err));
    }, [token, navigate]);

    const filteredEvents = events.filter(event =>
        event.location.toLowerCase().includes(search.toLowerCase())
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleBookNow = (eventId) => {
        console.log(eventId)
        navigate(`/book-event/${eventId}`);
    };

    return (
        <div className="container-fluid p-0">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <a className="navbar-brand" href="/home">Event Booking</a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/booked-tickets">Booked Tickets</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
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

            <div className="container mt-4">
                <h2 className="text-center my-4">Available Events</h2>

                <div className="row mb-4">
                    <div className="col-md-6 offset-md-3">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" onClick={() => setSearch("")}>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div key={event.id} className="col-lg-4 col-md-6 mb-4">
                                <div className="card shadow">
                                    <div className="card-body">
                                        <h5 className="card-title">{event.name}</h5>
                                        <p className="card-text">
                                            <strong>Date:</strong> {event.date}
                                            <br />
                                            <strong>Location:</strong> {event.location}
                                            <br />
                                            <strong>Seats Available:</strong> {event.available_seats}
                                        </p>
                                        <p className="card-text text-muted">{event.description}</p>
                                        <button className="btn btn-primary w-100" onClick={() => handleBookNow(event.id)}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center w-100">No events found for this location</p>
                    )}
                </div>
            </div>
        </div>
    );
}
