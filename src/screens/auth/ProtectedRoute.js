import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext.js";

const ProtectedRoute = ({ component: Component, requiredRole }) => {
  const { auth, loading  } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!auth || !auth.user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "admin" && !auth.user?.isAdmin) {
    return <Navigate to="/" replace />; 
  }
  
  if (requiredRole === "teamLeader" && !(auth.user?.isAdmin || auth.user?.isTeamLeader)) {
    return <Navigate to="/" replace />; 
  }

  return <Component />;
};

export default ProtectedRoute;
