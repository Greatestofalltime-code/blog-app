import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await login(email, password);
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
        Welcome back
      </h1>
      <p style={{ opacity: 0.6, marginBottom: "40px" }}>
        Login to your account
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
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={inputStyle}
        />
        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={btnStyle}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>

      <p style={{ marginTop: "24px", opacity: 0.6, fontSize: "0.9rem" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#f6a623", fontWeight: "600" }}>
          Register
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

export default Login;