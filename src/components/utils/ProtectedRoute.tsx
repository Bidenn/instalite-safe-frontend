import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    const encryptedToken = localStorage.getItem('token');

    if (!encryptedToken) {
        console.error("No token found in localStorage");
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
