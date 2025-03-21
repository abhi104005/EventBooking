import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateEvent() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;
    const [event,setEvent] = useState({
        name: "",
        date: "",
        location: "",
        description: "",
        available_seats: "",
    })
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(null);

    const handelChanges = (e) =>{
        setEvent({...event,[e.target.name]:e.target.value})
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
            if (decoded.role !== "admin") {
                navigate("/");
            }
        } catch (error) {
            console.error("Invalid token");
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        const newEvent = {
            name: event.name,
            date: event.date,
            location: event.location,
            description: event.description,
            available_seats: event.available_seats
        };
        console.log(newEvent)
        try {
            const response = await fetch("http://localhost:8080/addevent", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEvent),
            });
            const result = await response.json();
            if (response.ok) {
                setMessage({ type: "success", text: "Event created successfully" });
                return navigate("/adminHome");
            } else {
                setMessage({ type: "error", text: result.error || "Failed to create event " });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Server error, please try again" });
        }
    };

    return (
        <div >
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <a className="navbar-brand" href="/adminHome">Event Booking</a>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/eventlist">Your Events</a>
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

            <div className="card shadow p-4 mt-4">
                <h3 className="text-center mb-4">Create New Event</h3>

                {message && (
                    <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Event Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={event.name}
                            onChange={handelChanges}
                            pattern="^[A-Za-z\s]{5,}$"
                            title="Only letters and spaces are allowed & event name conatin more than 5 letter atleast"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="date"
                            value={event.date}
                            onChange={handelChanges}
                            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            className="form-control"
                            name="location"
                            value={event.location}
                            onChange={handelChanges}
                            pattern="^[A-Za-z\s]+$"
                            title="Only letters and spaces are allowed"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={event.description}
                            onChange={handelChanges}
                            pattern="^[A-Za-z\s]+$"
                            title="Only letters and spaces are allowed"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Available Seats</label>
                        <input
                            type="number"
                            className="form-control"
                            name="available_seats"
                            value={event.available_seats}
                            onChange={handelChanges}
                            min="1"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Create Event</button>
                </form>

            </div>
        </div>
    );
}
