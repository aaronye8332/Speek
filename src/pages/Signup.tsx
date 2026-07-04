import React, { useState } from "react";
import { createUser } from "../utils/storage";

export default function Signup(props: { onCancel: () => void; onSuccess: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCheck = () => {
    setError(null);
    if (!username.trim()) return setError("Username required");
    if (password.length < 4) return setError("Password must be at least 4 chars (demo)");
    try {
      createUser(username.trim(), password);
      props.onSuccess(username.trim());
    } catch (e: any) {
      setError(e.message || "Failed");
    }
  };

  return (
    <div className="center-screen">
      <div className="card narrow">
        <h2>Create account</h2>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label>Age Check (UI only)</label>
        <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 18" />
        <label>Email (UI only)</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Phone number (UI only)</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <div className="row">
          <button className="btn" onClick={handleCheck}>
            Check
          </button>
          <button className="btn ghost" onClick={props.onCancel}>
            Cancel
          </button>
        </div>
        <p className="muted">Age/email/phone verification postponed in this prototype.</p>
      </div>
    </div>
  );
}
