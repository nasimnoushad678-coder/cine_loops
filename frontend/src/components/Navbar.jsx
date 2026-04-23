import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

  return (
    <nav>
      <Link to="/">Home</Link>
      {user?.user_type === "theater" && (
  <Link to="/dashboard">Dashboard</Link>
)}
      {
        token ? (
      <button onClick={() => dispatch(logout())}>Logout</button>

        ) : <>
            <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
        </>
      }
      
    </nav>
  );
}