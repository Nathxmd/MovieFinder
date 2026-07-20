import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

export default function Auth() {
  const { signIn, signUp, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isForgotPassword = mode === "forgot";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isForgotPassword) {
      const { error: resetError } = await requestPasswordReset(email);
      setLoading(false);

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setMessage("Reset link sent. Check your email inbox.");
      return;
    }

    const action = mode === "signin" ? signIn : signUp;
    const { data, error: authError } = await action(email, password);

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (mode === "signup" && !data.session) {
      setMessage("Account created. Check your email to confirm your account.");
      return;
    }

    const redirectTo = location.state?.from?.pathname ?? "/";
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Movie Finder</p>
        <h1>
          {isForgotPassword
            ? "Forgot password"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </h1>
        <p className="auth-copy">
          {isForgotPassword
            ? "We will send a password reset link to your email."
            : "Use one account to manage watchlist and movie reviews across devices."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          {!isForgotPassword ? (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          ) : null}
          {error ? <p className="auth-error">{error}</p> : null}
          {message ? <p className="auth-message">{message}</p> : null}
          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isForgotPassword
                ? "Send reset link"
                : mode === "signin"
                  ? "Sign in"
                  : "Sign up"}
          </button>
        </form>

        <div className="auth-actions">
          {isForgotPassword ? (
            <button
              type="button"
              className="auth-switch"
              onClick={() => setMode("signin")}
            >
              Back to sign in
            </button>
          ) : (
            <>
              <button
                type="button"
                className="auth-switch"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin"
                  ? "Need an account? Create one"
                  : "Already have an account? Sign in"}
              </button>
              <button
                type="button"
                className="auth-switch"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
