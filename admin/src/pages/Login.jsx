import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";
import { backendUrl } from "../App.jsx";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dismissError = () => setError("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/auth/admin", {
        email,
        password,
      });

      if (response.status === 200) {
        setToken(response.data.token);
        setError("");
      } else {
        setError("Login Failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Login Failed. Please check your credentials.");
      console.log(err);
    }
  };

  return (
    <>
      <form
        className="loginform"
        method="post"
        onSubmit={onSubmit}
        noValidate
        aria-describedby="login-error"
      >
        <span id="login-label">Login</span>
        <input
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="input"
          type="email"
          placeholder="Email"
          aria-required="true"
          aria-invalid={error ? "true" : "false"}
          autoComplete="username"
        />
        <input
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="input"
          type="password"
          placeholder="Password"
          aria-required="true"
          aria-invalid={error ? "true" : "false"}
          autoComplete="current-password"
        />
        <button id="btn" type="submit">
          Login
        </button>
      </form>

      {error && (
        <ul
          className="notification-container"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          id="login-error"
        >
          <li className="notification-item error">
            <div className="notification-content">
              <div className="notification-icon" aria-hidden="true">
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <circle cx="12" cy="16" r="1" />
                </svg>
              </div>
              <div className="notification-text">{error}</div>
              <button
                onClick={dismissError}
                className="notification-icon notification-close"
                aria-label="Dismiss error notification"
                type="button"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="notification-progress-bar" />
          </li>
        </ul>
      )}
    </>
  );
}

export default Login;
