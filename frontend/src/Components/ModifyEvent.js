import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function ModifyEvent() {
    const { eventId } = useParams();
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;
    const [eventData, setEventData] = useState({
        name: "",
        date: "",
        location: "",
        description: "",
        available_seats: "",
    });
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        console.log(eventId)
        fetch("http://localhost:8080/event/" + eventId, {
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
            .then((data) => {
                setEventData({
                    name: data.name,
                    date: data.date,
                    location: data.location,
                    description: data.description,
                    available_seats: data.available_seats,
                });
            })
            .catch((err) => console.error("Error fetching event details:", err));
    }, [eventId, token, navigate]);

    const handleChange = (e) => {
        setEventData({
            ...eventData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(eventData)
        fetch("http://localhost:8080/updateevent/" + eventId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Event updated:", data);
                navigate("/eventlist");
            })
            .catch((err) => console.error("Error updating event:", err));
    };

    const handleDelete = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/deleteEvent/" + eventId, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                navigate("/eventlist");
            })
            .catch((err) => console.error("Error Deleting Event : ", err));
    }

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
            {/* Card Layout */}
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0 text-center">Modify Event</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Event Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={eventData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                name="date"
                                className="form-control"
                                value={eventData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="form-control"
                                value={eventData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                rows="3"
                                value={eventData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Available Seats</label>
                            <input
                                type="number"
                                name="available_seats"
                                className="form-control"
                                value={eventData.available_seats}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Button Group */}
                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-success px-4">Update Event</button>
                            <button type="button" className="btn btn-danger px-4" onClick={handleDelete}>Delete Event</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
