# CreditCoach Frontend

A React + Vite app for submitting mock credit data and viewing improvement tips.

## Setup & Run

1. Install dependencies:
   cd frontend
   npm install

2. Start the development server:
   npm run dev

## Usage
- Fill in the form or paste JSON credit data.
- Submit to analyze your credit data.
- View your credit score and improvement tips in the dashboard.

## Backend Setup
1. Install Python dependencies:
   cd backend
   pip install -r requirements.txt

2. Run Flask backend:
   python app.py

## API
- POST /analyze
- Request JSON:
  {
    "creditScore": 700,
    "creditCards": [
      { "name": "Visa", "balance": 1500, "limit": 5000, "paymentOnTime": true }
    ],
    "paymentHistory": [true, true, false, true, true, true]
  }
- Response JSON:
  {
    "creditScore": 700,
    "tips": ["Pay down your balances to reduce utilization.", "Set up payment reminders to avoid late payments."]
  }

## Notes
- Frontend runs on port 5173 by default, backend on 5000.
- CORS is enabled for local development.
