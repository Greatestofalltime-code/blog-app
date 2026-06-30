import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await register(name, email, password);
      loginUser(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "420px",
      margin: "80px auto",
      padding: "0 20px"
    }}>
      <h1 style={{
        fontSize: "2rem",
        fontWeight: "700",
        marginBottom: "8px"
      }}>
        Create account
      </h1>
      <p style={{ opacity: 0.6, marginBottom: "40px" }}>
        Join to leave comments and interact
      </p>

      {error && (
        <p style={{
          color: "#ff6b6b",
          marginBottom: "16px",
          fontSize: "0.9rem"
        }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          style={inputStyle}
        />
        <button
          onClick={handleRegister}
          disabled={isLoading}
          style={btnStyle}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </div>

      <p style={{ marginTop: "24px", opacity: 0.6, fontSize: "0.9rem" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#f6a623", fontWeight: "600" }}>
          Login
        </Link>
      </p>
    </div>
  );
}

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "2px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "inherit",
  fontSize: "1rem",
  outline: "none",
  fontFamily: "inherit",
};

const btnStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#f6a623",
  color: "#ffffff",
  fontSize: "1rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "opacity 0.3s",
};

export default Register;