import React, { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProjectPage from "./pages/ProjectPage";
import { getCurrentUser, setCurrentUser } from "./utils/storage";

type View =
  | { name: "landing" }
  | { name: "signup" }
  | { name: "login" }
  | { name: "projects"; username: string; isGuest: boolean };

export default function App() {
  const [view, setView] = useState<View>({ name: "landing" });

  useEffect(() => {
    const cur = getCurrentUser();
    if (cur) {
      setView({ name: "projects", username: cur.username, isGuest: cur.isGuest });
    }
  }, []);

  const goToProjects = (username: string, isGuest = false) => {
    setCurrentUser(username, isGuest);
    setView({ name: "projects", username, isGuest });
  };

  return (
    <div className="app-root">
      {view.name === "landing" && (
        <Landing
          onSignup={() => setView({ name: "signup" })}
          onLogin={() => setView({ name: "login" })}
          onGuest={() => goToProjects("guest", true)}
          onMoreInfo={() => alert("Simple prototype: draw frames, save to gallery.")}
        />
      )}

      {view.name === "signup" && (
        <Signup onCancel={() => setView({ name: "landing" })} onSuccess={(username) => goToProjects(username)} />
      )}

      {view.name === "login" && (
        <Login onCancel={() => setView({ name: "landing" })} onSuccess={(username) => goToProjects(username)} />
      )}

      {view.name === "projects" && (
        <ProjectPage
          username={view.username}
          isGuest={view.isGuest}
          onLogout={() => {
            setCurrentUser("", false);
            setView({ name: "landing" });
          }}
        />
      )}
    </div>
  );
}
