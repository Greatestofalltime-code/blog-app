import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Kanu.dev
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin">Admin</Link>
            )}
            <span style={{ opacity: 0.6, fontSize: "0.9rem" }}>
              {user.name}
            </span>
            <button
              className="theme-toggle"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="theme-toggle">Login</button>
          </Link>
        )}

        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;