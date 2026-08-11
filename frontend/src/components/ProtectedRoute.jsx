import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userDataContext } from "../context/DataContext.jsx";

export default function ProtectedRoute({ children }) {
  const { userData, loadingUser } = useContext(userDataContext);

  // still checking session
  if (loadingUser) {
    return <p className="text-center mt-10">Checking login...</p>;
  }

  // not logged in
  if (!userData) {
    return <Navigate to="/login" />;
  }

  // logged in
  return children;
}