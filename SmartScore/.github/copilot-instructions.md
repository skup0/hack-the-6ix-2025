<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# SmartScore - Personal Credit Coach

## Architecture Overview
- This project is a **client-side only** React application deployed on GitHub Pages.
- **No backend required** - all credit analysis is performed in the browser using JavaScript.
- Data flows from the frontend form to client-side analysis functions, and results are displayed in the dashboard UI.

## Frontend (React + Vite)
- Main entry: `/frontend/src/App.jsx`.
- Form allows manual entry of credit data with validation.
- Credit analysis performed by `analyzeCreditProfile()` function within App.jsx.
- Displays credit score and personalized tips in a dashboard UI.
- Canadian credit system focused (300-900 score range).

## Credit Analysis Features
- **Credit utilization calculation** across all credit cards
- **Payment history analysis** for last 6 months
- **Credit score range assessment** with Canadian-specific advice
- **Credit mix recommendations**
- **Canadian-specific tips** (Equifax/TransUnion references)

## Developer Workflows
- **Development**: `npm run dev` in `/frontend` directory
- **Build**: `npm run build` for production builds
- **Deploy**: `npm run deploy` to publish to GitHub Pages
- **Live site**: https://skup0.github.io/hack-the-6ix-2025/

## Conventions & Patterns
- Single-file React app with embedded analysis logic
- Modern glassmorphism UI design
- Client-side only processing (no network requests)
- Canadian credit system focused

## Key Files
- `/frontend/src/App.jsx`: Main React UI and credit analysis logic
- `/frontend/src/index.css`: Glassmorphism styling
- `/frontend/package.json`: Dependencies and deploy scripts
- `/.vscode/tasks.json`: VS Code development tasks

## Example Data
```javascript
{
  "creditScore": 700,
  "creditCards": [
    { "name": "RBC Visa", "balance": 1500, "limit": 5000, "paymentOnTime": true }
  ],
  "paymentHistory": [true, true, false, true, true, true]
}
```

## Deployment
- Hosted on GitHub Pages at: https://skup0.github.io/hack-the-6ix-2025/
- Automatic deployment via `gh-pages` npm package
- No server infrastructure required
