import React, { useState, useEffect } from "react";
import { getUserProjects, saveUserProject, getGuestProjects, saveGuestProject } from "../utils/storage";
import { Project } from "../utils/storage";
import CanvasEditor from "../components/CanvasEditor";

export default function ProjectPage(props: { username: string; isGuest: boolean; onLogout: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (props.isGuest) {
      setProjects(getGuestProjects());
    } else {
      setProjects(getUserProjects(props.username));
    }
  }, [props.username, props.isGuest]);

  const createNewProject = (name: string, frames: string[]) => {
    const p: Project = { id: Date.now().toString(), name: name || `Project ${projects.length + 1}`, frames, createdAt: Date.now() };
    if (props.isGuest) {
      saveGuestProject(p);
      setProjects(getGuestProjects());
    } else {
      saveUserProject(props.username, p);
      setProjects(getUserProjects(props.username));
    }
  };

  return (
    <div className="project-root">
      <header className="topbar">
        <h3>Projects — {props.isGuest ? "Guest (temporary)" : props.username}</h3>
        <div>
          <button className="btn ghost" onClick={props.onLogout}>
            Log out
          </button>
        </div>
      </header>

      <main className="project-main">
        {projects.length === 0 && <div className="empty">No projects yet. Use the + button to create one.</div>}

        <div className="project-grid">
          {projects.map((p) => (
            <div key={p.id} className="project-card">
              <div className="thumb">
                {p.frames[0] ? <img src={p.frames[0]} alt={p.name} /> : <div className="placeholder">No frames</div>}
              </div>
              <div className="meta">
                <strong>{p.name}</strong>
                <div className="muted">{p.frames.length} frame(s)</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <button
        className="fab"
        title="Create movie"
        onClick={() => {
          setCreating(true);
        }}
      >
        +
      </button>

      {creating && (
        <div className="modal">
          <div className="modal-card">
            <CanvasEditor
              onCancel={() => setCreating(false)}
              onSave={(name, frames) => {
                createNewProject(name, frames);
                setCreating(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
