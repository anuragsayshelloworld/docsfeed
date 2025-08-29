import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = JSON.parse(localStorage.getItem("auth"));

  // timestamp wala logic lagera session 1 day ma expire garne banaune
  //password hash ni garna parla maybe idc anyway
  if (!auth || !auth.userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
