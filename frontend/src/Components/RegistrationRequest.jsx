import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export function RegistrationRequest() {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleAccept = (id) => {
        if (window.confirm("Do you really want to accept this request?")) {
            fetch("http://localhost:8080/acceptreq", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ uid: id, status: "accepted" })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    alert("User accepted successfully!");
                    navigate(0);
                })
                .catch(err => console.error("Error:", err));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Do you really want to Reject this request?")) {
            fetch("http://localhost:8080/acceptreq", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ uid: id, status: "rejected" })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    alert("User Rejected successfully!");
                    navigate(0);
                })
                .catch(err => console.error("Error:", err));
        }
    }


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                jwtDecode(token);
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

        fetch("http://localhost:8080/getreq", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}`, }
        }).then(data => data.json())
            .then(result => { setUsers(result.data); })

    }, [token,navigate])

    return (<div>
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
        <div className="container mt-4">
            <h2>Registration Requests</h2>
            <table className="table table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Request For Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="btn btn-success mx-1" onClick={() => handleAccept(user.id)}>Accept</button>
                                    <button className="btn btn-danger mx-1" onClick={() => handleDelete(user.id)}>Reject</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No pending requests</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>)
}