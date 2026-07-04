import React from "react";

export default function Landing(props: {
  onSignup: () => void;
  onLogin: () => void;
  onGuest: () => void;
  onMoreInfo: () => void;
}) {
  return (
    <div className="center-screen">
      <div className="card">
        <h1>Movie Draw</h1>
        <div className="button-grid">
          <button className="btn" onClick={props.onSignup}>
            Sign up
          </button>
          <button className="btn" onClick={props.onLogin}>
            Log in
          </button>
          <button className="btn" onClick={props.onGuest}>
            Guest
          </button>
          <button className="btn" onClick={props.onMoreInfo}>
            More info
          </button>
        </div>
        <p className="muted">Prototype: drawings saved locally. Guest projects are temporary.</p>
      </div>
    </div>
  );
}
