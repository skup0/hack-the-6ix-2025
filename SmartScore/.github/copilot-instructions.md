<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CreditCoach Project Copilot Instructions

## Architecture Overview
- This project is a full-stack MVP with a Python Flask backend and a React (Vite) JavaScript frontend.
- Backend and frontend are in separate folders: `/backend` for Flask, `/frontend` for React.
- Data flows from the frontend form (user input or pasted JSON) to the backend `/analyze` endpoint via POST, and results are displayed in the dashboard UI.

## Backend (Flask)
- Main entry: `/backend/app.py`.
- One POST endpoint `/analyze` accepts JSON: `{ creditScore, creditCards: [{ name, balance, limit, paymentOnTime }], paymentHistory: [last6Months] }`.
- Applies rules: if credit utilization > 0.3, suggest pay down balances; if any late payments, suggest payment reminders.
- Returns: `{ creditScore, tips: [ ... ] }`.
- CORS enabled for local frontend communication.
- Error handling: validates input structure and types, returns 400 for invalid data.

## Frontend (React + Vite)
- Main entry: `/frontend/src/App.jsx`.
- Form allows manual entry or pasting JSON; validates before sending.
- Uses fetch API to POST to `/analyze`.
- Displays returned score and tips in a dashboard UI.
- Basic error handling: shows validation and network errors to user.

## Developer Workflows
- Backend: run with `python app.py` in `/backend` (requires Flask, flask-cors).
- Frontend: run with `npm install && npm run dev` in `/frontend`.
- Both can run locally; CORS is set for local dev.

## Conventions & Patterns
- Modular code: backend logic in functions, frontend UI in components.
- Clear comments explain each part of the code.
- Input validation on both sides.

## Key Files
- `/backend/app.py`: Flask API logic
- `/frontend/src/App.jsx`: Main React UI
- `/frontend/package.json`: Frontend dependencies
- `/backend/requirements.txt`: Backend dependencies

## Integration Points
- Frontend fetches from backend at `http://localhost:5000/analyze` (default Flask port).
- CORS must be enabled in Flask for local dev.

## Example Data
```
{
  "creditScore": 700,
  "creditCards": [
    { "name": "Visa", "balance": 1500, "limit": 5000, "paymentOnTime": true }
  ],
  "paymentHistory": [true, true, false, true, true, true]
}
```

## README & Tasks
- See README.md for setup and run instructions.
- Tasks.json in .vscode for build/run tasks.
