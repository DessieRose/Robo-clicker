import React, {useState} from "react";
import './StartScreen.css';

const AuthScreen = ({ onGuest, onLogin, onSignUp }) => {
    const [mode, setMode] = useState("login"); // "login" or "signup"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
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
        <div className="auth-screen">
            <div className="auth-card">
                <h1 className="auth-title">RoboClicker</h1>
                <p className="auth-subtitle">Fight robots. Level up. Rule the machines.</p>

                {/* Guest Options */}
                <button className="auth-guest-btn" onClick={onGuest}>
                    ▶ Play as Guest
                </button>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                {/* Login or Signup */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === "login" ? "auth-tab--active" : ""}`}
                        onClick={() => { setMode("login"); setError(""); }}
                    >
                        Log In
                    </button>
                    <button
                        className={`auth-tab ${mode === "signup" ? "auth-tab--active" : ""}`}
                        onClick={() => { setMode("signup"); setError(""); }}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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

                    <button
                        className="auth-submit-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
                    </button>

                    {mode === "signup" && (
                        <p className="auth-info">
                            Already have an account?{' '}
                            <span className="auth-link" onClick={() => { setMode("login"); setError(""); }}>
                                Log In
                            </span>
                        </p>
                    )}

                </form>

            </div>
        </div>
    );
};

export default AuthScreen;
