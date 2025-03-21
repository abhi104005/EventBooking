import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AdminEventList() {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const navigate = useNavigate();

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

    useEffect(() => {
        if (user ) {
            fetch(`http://localhost:8080/adminevents/${user.id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    setEvents(data.events);
                })
                .catch((err) => console.error("Error fetching events:", err));
        }
    }, [user,token]);

    const handleModifyEvent = (eventId) => {
        navigate(`/modifyevent/${eventId}`);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <a className="navbar-brand" href="/adminHome">Event Booking</a>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/addevent">Add Event</a>
                        </li>
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

            <div className="container mt-4">
                <h2 className="text-center my-4"><b>Event</b></h2>

                {events.length > 0 ? (
                    <div className="row">
                        {events.map((event) => (
                            <div key={event.id} className="col-lg-4 col-md-6 mb-4">
                                <div className="card shadow">
                                    <div className="card-body">
                                        <h5 className="card-title">{event.name}</h5>
                                        <p className="card-text">
                                            <strong>Date:</strong> {event.date}<br />
                                            <strong>Location:</strong> {event.location}<br />
                                            <strong>Available Seats:</strong> {event.available_seats}
                                        </p>
                                        <p className="card-text text-muted">{event.description}</p>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleModifyEvent(event.id)}
                                        >
                                            Modify
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">No events found</p>
                )}
            </div>
        </div>
    );
}
