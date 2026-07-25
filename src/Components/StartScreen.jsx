import React, { useState } from 'react';
import startPageImg from '../Images/start-page/startpage.png';
import logo from '../Images/start-page/logo.png';
import './StartScreen.css';

export default function StartScreen({ user, onStart, onGuest, onLogin, onSignUp, loadingText }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields.");
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await onLogin(email, password);
      } else {
        await onSignUp(email, password);
      }
    } catch (err) {
      setError(err.message ?? "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-screen">
      <img src={logo} alt="Robo Clicker Logo" className="start-screen__logo" />
      <img src={startPageImg} alt="Robo Clicker" className="start-screen__image" />

      <div className="start-screen__auth">
        {loadingText ? (
          <>
            <p className="loading-text">{loadingText}</p>
            <div className="loading-bar">
              <div className="loading-bar_fill" />
            </div>
          </>
        ) : user ? (
          <>
            <p className="auth-subtitle">Welcome back, {user.email}!</p>
            <button className="start-screen__button" onClick={onStart}>
              START GAME
            </button>
          </>
        ) : (
          <>
            <button className="auth-guest-btn" onClick={onGuest}>
              ▶ Play as Guest
            </button>

            <div className="auth-divider"><span>or</span></div>

            <div className="auth-tabs">
              <button
                className={`auth-tab ${mode === "login" ? "auth-tab--active" : ""}`}
                onClick={() => { setMode("login"); setError(""); }}
              >Log In</button>
              <button
                className={`auth-tab ${mode === "signup" ? "auth-tab--active" : ""}`}
                onClick={() => { setMode("signup"); setError(""); }}
              >Sign Up</button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                className="auth-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {error && <p className="auth-error">{error}</p>}
              <button className="auth-submit-btn" type="submit" disabled={loading}>
                {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
