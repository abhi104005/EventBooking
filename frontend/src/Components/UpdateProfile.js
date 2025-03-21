import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export function UpdateProfile() {
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token")
    const isLoggedIn = !!token;
    const navigate = useNavigate();
    const [data, updateData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        updateData({
            ...data, [e.target.name]: e.target.value
        })
    }



    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decode = jwtDecode(token);
                setUserRole(decode.role)
                setUser(decode);
            } catch (error) {
                console.error("Invalid token");
                localStorage.removeItem("token");
                navigate("/login");
            }
        } else {
            console.error("Session Expired");
            navigate("/login");
        }
    }, [navigate]);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:8080/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
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
                    updateData({
                        name: data.dto.name,
                        email: data.dto.email,
                        password: ""
                    })
                })
                .catch((error) => console.error("Error fetching user:", error));
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            const response = await fetch("http://localhost:8080/updatepro", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message)
                navigate(userRole === "admin" ? "/adminHome" : "/home");
            } else {
                console.log(data)
                alert("Something Went Wrong");
            }
        }
    }

    return (<div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <a className="navbar-brand" href={userRole === "admin" ? "/adminHome" : "/home"}>
                Event Booking
            </a>
            <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                <ul className="navbar-nav">
                    {userRole === "admin" ? (
                        <li className="nav-item">
                            <a className="nav-link" href="/addevent">Add Event</a>
                        </li>
                    ) : (
                        <li className="nav-item">
                            <a className="nav-link" href="/booked-tickets">Booked Tickets</a>
                        </li>
                    )}
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

        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card shadow-lg">
                    <div className="card-header bg-primary text-white text-center">
                        <h4>Update Profile</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={data.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={data.password}
                                    onChange={handleChange}
                                    pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    title="Password must contain at least 8 characters, including 1 uppercase letter, 1 number, and 1 special character."
                                    required
                                />
                            </div>
                            <div className="d-flex justify-content-center mt-4">
                                <button type="submit" className="btn btn-success w-100">Update Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}