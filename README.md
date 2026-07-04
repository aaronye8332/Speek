# Simple Movie Draw Prototype (React + TypeScript + Vite)

This is a minimal single-page prototype implementing the flow you described:

- Landing screen with four center buttons: Sign up, Log in, Guest, More info
- Sign up form (username, password, Age/Email/Phone fields shown but verification postponed) with a "Check" button
- Log in with existing local accounts
- Guest flow creates a temporary local project stored in sessionStorage (cleared on browser close)
- Project page with a floating "+" circle button to create a new movie
- Canvas drawing tools: Pencil (thin) and Marker (thicker & semi-transparent)
- Save drawings into a gallery; registered users persist to localStorage, guests persist to sessionStorage

This prototype is intentionally simple and uses client-side storage only.

Run locally:
1. Install deps:
   - npm install
2. Start dev server:
   - npm run dev
3. Open http://localhost:5173

Notes:
- No backend/auth — accounts are stored in localStorage for demo only.
- Age check / email / phone verification are left as UI fields only (no verification).
- Guest projects are stored in sessionStorage and cleared on browser close.
