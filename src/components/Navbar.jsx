import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Kanu.dev
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;