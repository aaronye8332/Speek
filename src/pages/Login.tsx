import React, { useState } from "react";
import { validateUser } from "../utils/storage";

export default function Login(props: { onCancel: () => void; onSuccess: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    if (!username.trim()) return setError("Enter username");
    if (!validateUser(username.trim(), password)) return setError("Invalid username/password");
    props.onSuccess(username.trim());
  };

  return (
    <div className="center-screen">
      <div className="card narrow">
        <h2>Log in</h2>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <div className="row">
          <button className="btn" onClick={handleLogin}>
            Log in
          </button>
          <button className="btn ghost" onClick={props.onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
