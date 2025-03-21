import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;
        if (allowedRoles.includes(userRole)) {
            return <Outlet />;
        } else {
            localStorage.removeItem("token");
            alert("Something went wrong redirecting to login....")
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
}
