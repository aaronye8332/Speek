export type Frame = string; // dataURL
export type Project = {
  id: string;
  name: string;
  frames: Frame[];
  createdAt: number;
};

type UserRecord = {
  password: string;
  projects: Project[];
};

const USERS_KEY = "md_users";
const CUR_USER_KEY = "md_current_user"; // stored in sessionStorage

export function getUsers(): Record<string, UserRecord> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveUsers(users: Record<string, UserRecord>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function createUser(username: string, password: string) {
  const users = getUsers();
  if (users[username]) throw new Error("User exists");
  users[username] = { password, projects: [] };
  saveUsers(users);
}

export function validateUser(username: string, password: string) {
  const users = getUsers();
  return !!users[username] && users[username].password === password;
}

export function getUserProjects(username: string): Project[] {
  const users = getUsers();
  return users[username]?.projects || [];
}

export function saveUserProject(username: string, project: Project) {
  const users = getUsers();
  if (!users[username]) users[username] = { password: "", projects: [] };
  users[username].projects = users[username].projects || [];
  users[username].projects.push(project);
  saveUsers(users);
}

export function setCurrentUser(username: string, isGuest: boolean) {
  if (!username) {
    sessionStorage.removeItem(CUR_USER_KEY);
  } else {
    sessionStorage.setItem(CUR_USER_KEY, JSON.stringify({ username, isGuest }));
  }
}

export function getCurrentUser(): { username: string; isGuest: boolean } | null {
  try {
    return JSON.parse(sessionStorage.getItem(CUR_USER_KEY) || "null");
  } catch {
    return null;
  }
}

// Guest storage (sessionStorage)
const GUEST_KEY = "md_guest_projects";
export function getGuestProjects(): Project[] {
  try {
    return JSON.parse(sessionStorage.getItem(GUEST_KEY) || "[]");
  } catch {
    return [];
  }
}
export function saveGuestProject(project: Project) {
  const ps = getGuestProjects();
  ps.push(project);
  sessionStorage.setItem(GUEST_KEY, JSON.stringify(ps));
}
